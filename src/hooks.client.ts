import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_SENTRY_DSN, PUBLIC_SENTRY_ENVIRONMENT, PUBLIC_STRIPE_RETURN_URL } from '$env/static/public';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { goto } from '$app/navigation';
import { type ActionPerformed, type PushNotificationSchema, PushNotifications, type Token } from '@capacitor/push-notifications';
import { NativeAudio } from '@capgo/native-audio';
import { notificationToast } from '$lib/components/layout/toasts.ts';
import { get_all_possible_notifications } from '$lib/utilities/notificationUtilities.ts';
import { Haptics } from '@capacitor/haptics';
import { AppStorage } from '$lib/scanners/storage.ts';
import { getCookie, getUserFromToken, setCookie } from '$lib/auth/auth.ts';
import { auth } from '$lib/states/auth.svelte.ts';

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  enabled: true,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.5,

  // Optional: Initialize Session Replay:
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: PUBLIC_SENTRY_ENVIRONMENT
});

export const handleError = Sentry.handleErrorWithSentry();

const token = getCookie('access_token');
if (token) {
  try {
    auth.user = getUserFromToken(token);
  } catch (e) {
    setCookie('access_token', "", 0);
    console.error(e);
  }
}

async function preloadAudio() {
  try{
    const path = 'sounds/'
    await NativeAudio.preload({
      assetId: "oneBeep",
      assetPath: path + "scansound_one_beep.wav",
      audioChannelNum: 1,
      isUrl: false
    })
    await NativeAudio.preload({
      assetId: "twoBeep",
      assetPath: path + "scansound_two_beeps.wav",
      audioChannelNum: 1,
      isUrl: false
    })
    await NativeAudio.preload({
      assetId: "longBeep",
      assetPath: path + "scansound_long_beep.wav",
      audioChannelNum: 1,
      isUrl: false
    })
  } catch (e) {
    console.log(e)
  }
}
preloadAudio()

App.addListener('appUrlOpen', async (event) => {
  if (event.url.startsWith('ingenium://')) {
    await Browser.close(); // Close the in-app browser
    await goto(decodeURI(event.url.replace('ingenium:/', '')))
  }
});

Browser.addListener('browserFinished', () => {
  if (location.pathname === "/auth/login") {
    goto('/')
  }
});


PushNotifications.requestPermissions().then((result) => {
  if (result.receive === 'granted') {
    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();
  } else {
    // Show some error
  }
});

// On success, we should be able to receive notifications
PushNotifications.addListener('registration', (token: Token) => {
  console.log('Push registration success, token: ' + token.value);
  notification_token = token.value;
  get_all_possible_notifications()
});

// Some issue with our setup and push will not work
PushNotifications.addListener('registrationError', (error) => {
  console.log('Error on registration: ' + JSON.stringify(error));
});


async function get_vibrations() {
  let storedVibration = await AppStorage.getWide("vibration")
  if (storedVibration !== undefined && storedVibration !== null) {
    storedVibration = JSON.parse(storedVibration)
    setVibration(storedVibration)
  }
}
get_vibrations()
// Show us the notification payload if the app is open on our device
PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
  console.log('Push received: ' + JSON.stringify(notification));

  const notification_toast = "" +
    `<p class='text-gray-800 font-bold'>${notification.title}</p> 
     <hr class="nav-dropdown-divider">
     <div style='margin-top: 4px'
      <p>${notification.body}</p>
     </div>`

  notificationToast(notification_toast);
  if (vibration) {
    Haptics.vibrate({duration: 700})
  }
});

// Method called when tapping on a notification
PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
  console.log('Push action performed: ' + JSON.stringify(notification));
  if (notification.notification.data && notification.notification.data.path) {
    goto(notification.notification.data.path)
  } else {
    goto("/events")
  }
});

export function setVibration(setValue: boolean) {
  vibration = setValue;
}

async function get_was_paying() {
  let storedPaying = await AppStorage.getWide("was_paying")
  if (storedPaying !== undefined && storedPaying !== null) {
    storedPaying = JSON.parse(storedPaying)
    if (storedPaying) {
      goto(PUBLIC_STRIPE_RETURN_URL)
    }
  }
}
get_was_paying()

export let vibration = true
export let notification_token: string = "";