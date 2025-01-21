import {NgOptimizedImage} from "@angular/common";
import {ApplicationConfig, ErrorHandler, importProvidersFrom, isDevMode} from "@angular/core";
import {BrowserModule, provideClientHydration} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxsModule} from "@ngxs/store";
import {ToastrModule} from "ngx-toastr";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import * as Sentry from "@sentry/angular";
import {OAuthModule, OAuthStorage} from "angular-oauth2-oidc";

import {AppRoutingModule} from "@ingenium/app/app-routing.module";
import {CartState, UserState} from "@ingenium/app/core/store";
import {JWTInterceptor} from "@ingenium/app/core/interceptors/jwt-interceptor.service";
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
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
}
