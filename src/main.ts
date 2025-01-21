import {enableProdMode} from "@angular/core";
import {bootstrapApplication} from "@angular/platform-browser";
import * as Sentry from "@sentry/angular";

import {apiEnviroment} from '@ingenium/environments/environment';
import {AppComponent} from "@ingenium/app/app.component";
import {appConfig} from "@ingenium/app/app.config";


Sentry.init({
  dsn: "https://50ffd26da050af7ec4e2122b7e5ab77a@o4507006131437568.ingest.us.sentry.io/4507006138777600",
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/ingeniumua\.be\/api/, /^https:\/\/hub\.dev\.ingeniumua\.be\/api/],
  enabled: apiEnviroment.name !== 'development',
  environment: apiEnviroment.name,
  release: apiEnviroment.versions.revision,
});

if (apiEnviroment.name !== 'development') {
  enableProdMode();
}
bootstrapApplication(AppComponent, appConfig)
  .then((_success) => console.log('Bootstrap success'))
  .catch((err) => console.error(err));
