import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_API_URL, PUBLIC_SENTRY_DSN } from '$env/static/public';
import {dev} from "$app/environment";

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  enabled: !dev,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.5,

  integrations: [
    // Initialize Distributed Tracing on the client side
    Sentry.browserTracingIntegration(),
    // Initialize Session Replay
    Sentry.replayIntegration()
  ],

  // Enabling traces to be added to external API
  tracePropagationTargets: [
    // same-origin requests
    /^\/(?!\/)/,
    // external API(s)
    PUBLIC_API_URL,
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

export const handleError = Sentry.handleErrorWithSentry();