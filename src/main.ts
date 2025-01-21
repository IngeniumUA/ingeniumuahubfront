import { enableProdMode, ErrorHandler, provideAppInitializer, inject, isDevMode, importProvidersFrom } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import * as Sentry from "@sentry/angular";


import { storageFactory } from './app/app.module';
import { apiEnviroment } from './environments/environment';
import { Router } from "@angular/router";
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { JWTInterceptor } from "./app/core/interceptors/jwt-interceptor.service";
import { OAuthStorage, OAuthModule } from "angular-oauth2-oidc";
import { provideClientHydration, BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { AppRoutingModule } from "./app/app-routing.module";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { ToastrModule } from "ngx-toastr";
import { NgOptimizedImage } from "@angular/common";
import { NgxsModule } from "@ngxs/store";
import { UserState, CartState } from "./app/core/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { AppComponent } from "./app/app.component";


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
bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, ReactiveFormsModule, MatRadioModule, MatButtonModule, ToastrModule.forRoot(), NgOptimizedImage, OAuthModule.forRoot(), NgxsModule.forRoot([UserState, CartState], {
            developmentMode: isDevMode(),
        }), NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: !isDevMode(),
        })),
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler({
                showDialog: false,
            }),
        }, {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        provideAppInitializer(() => {
            const initializerFn = (() => () => {
            })(inject(Sentry.TraceService));
            return initializerFn();
        }),
        { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
        {
            provide: OAuthStorage, useFactory: () => {
                if (typeof localStorage !== 'undefined') {
                    return localStorage;
                }
                return null;
            }
        },
        provideClientHydration(),
        provideHttpClient(withFetch()),
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        provideAnimations()
    ]
})
  .then((_success) => console.log('Bootstrap success'))
  .catch((err) => console.error(err));
