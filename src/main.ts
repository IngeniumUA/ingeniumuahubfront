import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/capacitor';
import * as SentryAngular from '@sentry/angular';

import { AppModule } from './app/app.module';
import { apiEnviroment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';

Sentry.init({
    dsn: "https://832eff534433afa7d7be27a930c422d4@o4507006131437568.ingest.us.sentry.io/4508667027783680",
    integrations: [
      SentryAngular.browserTracingIntegration(),
    ],
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/ingeniumua\.be\/api/, /^https:\/\/hub\.dev\.ingeniumua\.be\/api/],
    // enabled: apiEnviroment.name !== 'development',
    enabled: true, // disabled sentry in app cuz it no workey
    environment: apiEnviroment.name,
    release: apiEnviroment.versions.revision,

    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  },
  // Forward the init method from @sentry/angular
  SentryAngular.init
);

// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window).then();

if (apiEnviroment.name !== 'development') {
  enableProdMode();
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((_success) => console.log('Bootstrap success'))
  .catch((err) => console.error(err));
