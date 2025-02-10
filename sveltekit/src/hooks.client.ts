import * as Sentry from "@sentry/sveltekit";
import {PUBLIC_SENTRY_DSN} from "$env/static/public";
import {dev} from "$app/environment";

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  enabled: !dev,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Optional: Initialize Session Replay:
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const handleError = Sentry.handleErrorWithSentry();