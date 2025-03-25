import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { goto } from '$app/navigation';
import { type ActionPerformed, type PushNotificationSchema, PushNotifications, type Token } from '@capacitor/push-notifications';

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
});

export const handleError = Sentry.handleErrorWithSentry();

App.addListener('appUrlOpen', async (event) => {
  if (event.url.startsWith('ingenium://')) {
    await Browser.close(); // Close the in-app browser
    goto(decodeURI(event.url.replace('ingenium:/', '')))
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
  // get_all_possible_notifications()
});

// Some issue with our setup and push will not work
PushNotifications.addListener('registrationError', (error: any) => {
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

// function get_all_possible_notifications() {
//   this.storage.getWide("notifications_general")?.then((result) => {
//     if (result === undefined || result === null || result === "false") {
//       this.notificationService.queryNotification().pipe(first()).subscribe({
//         next: data => {
//
//           this.storage.getWide("notifications")?.then((stored_notification_options) =>{
//             if (stored_notification_options !== undefined && stored_notification_options !== null) {
//               stored_notification_options = JSON.parse(stored_notification_options);
//               let stored_option: keyof typeof stored_notification_options;
//               for (let item of data) {
//                 let is_in_storage = false
//                 for (stored_option in stored_notification_options) {
//                   if (""+item.item.id === stored_option) {
//                     is_in_storage = true
//                     break
//                   }
//                 }
//                 if (!is_in_storage && item.derived_type.derived_type_enum === "notificationitem" && item.derived_type.default_subscription) {
//                   this.notificationService.subscribe_to_topic(""+item.item.id).subscribe()
//                 }
//               }
//             } else {
//               for (let item of data) {
//                 if (item.derived_type.derived_type_enum === "notificationitem" && item.derived_type.default_subscription) {
//                   this.notificationService.subscribe_to_topic("" + item.item.id).subscribe()
//                 }
//               }
//             }
//           });
//         }
//       })
//     }
//   })
// }

export let notification_token: string = "";