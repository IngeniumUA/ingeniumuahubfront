import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';
import { goto } from '$app/navigation';

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