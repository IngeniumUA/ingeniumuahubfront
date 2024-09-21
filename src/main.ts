import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import * as Sentry from "@sentry/angular";


import { AppModule } from './app/app.module';
import { apiEnviroment } from './environments/environment';


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
});

enableProdMode();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((_success) => console.log('Bootstrap success'))
  .catch((err) => console.error(err));
