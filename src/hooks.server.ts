import * as Sentry from "@sentry/sveltekit";
import {sequence} from "@sveltejs/kit/hooks";
import {PUBLIC_SENTRY_DSN} from "$env/static/public";
import {dev} from "$app/environment";

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.75,
  enabled: !dev,
});

export const handleError = Sentry.handleErrorWithSentry();

export const handle = sequence(Sentry.sentryHandle(), ({ event, resolve }) => {
  event.params.__ACCESS_TOKEN__ = event.cookies.get('access_token'); // USE __X__ to prevent it interfering with other params
  event.params.__ID_TOKEN__ = event.cookies.get('id_token');
  return resolve(event);
});