import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_API_URL, PUBLIC_SENTRY_DSN, PUBLIC_SENTRY_ENVIRONMENT } from '$env/static/public';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { goto } from '$app/navigation';
import { type ActionPerformed, type PushNotificationSchema, PushNotifications, type Token } from '@capacitor/push-notifications';
import { NativeAudio } from '@capgo/native-audio';
import { AppStorage } from '$lib/scanners/storage.ts';


Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  enabled: true,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.5,

  // Optional: Initialize Session Replay:
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: PUBLIC_SENTRY_ENVIRONMENT
});

export const handleError = Sentry.handleErrorWithSentry();

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
  console.log('url: ');
  console.log(event.url)
  if (event.url.startsWith('ingenium://')) {
    await Browser.close(); // Close the in-app browser
    await goto(decodeURI(event.url.replace('ingenium:/', '')))
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

// Show us the notification payload if the app is open on our device
PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
  console.log('Push received: ' + JSON.stringify(notification));
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

function get_all_possible_notifications() {
  AppStorage.getWide("notifications_general")?.then(async (result) => {
    if (result === undefined || result === null || result === "false") {
      const fetchData = await queryNotification()
      AppStorage.getWide("notifications")?.then(async (stored_notification_options) => {
        if (stored_notification_options !== undefined && stored_notification_options !== null) {
          stored_notification_options = JSON.parse(stored_notification_options);
          let stored_option: keyof typeof stored_notification_options;
          for (const item of fetchData) {
            let is_in_storage = false
            for (stored_option in stored_notification_options) {
              if ("" + item.item.id === stored_option) {
                is_in_storage = true
                break
              }
            }
            if (!is_in_storage && item.derived_type.derived_type_enum === "notificationitem" && item.derived_type.default_subscription) {
              await subscribe_to_topic("" + item.item.id)
            }
          }
        } else {
          for (const item of fetchData) {
            if (item.derived_type.derived_type_enum === "notificationitem" && item.derived_type.default_subscription) {
              await subscribe_to_topic("" + item.item.id)
            }
          }
        }
      });
    }
  })
}

function subscribe_to_topic(item: string | number) {
  const payload = {
    token: notification_token
  }
  return fetch(`${PUBLIC_API_URL}/item/notification/subscribe/${item}`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }).then(r => r.json())
}

function queryNotification(limit: number = 10, offset: number = 0) {
  const param = {
    limit: limit,
    offset: offset
  }
  const params = new URLSearchParams(removeNull(param));
  return fetch(`${PUBLIC_API_URL}/item/notification/?${params.toString()}`).then(r => r.json())
}

function removeNull<T>(obj: T | any): T | any {
  Object.keys(obj).forEach((key) => {
    // Delete if the value is null or undefined
    if (obj[key] == null) {
      delete obj[key];
    }
    else if (obj[key] && typeof obj[key] === 'object') {
      // If the object is an empty array, delete the key
      if (Array.isArray(obj[key]) && obj[key].length === 0) {
        delete obj[key];
      } else {
        // Recursively call removeNull for nested objects
        removeNull(obj[key]);
      }
    }
  })
  return obj;
}

export let notification_token: string = "";