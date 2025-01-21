import { ErrorHandler, NgModule, isDevMode, inject, provideAppInitializer } from '@angular/core';
import {Router} from "@angular/router";
import {NgOptimizedImage} from '@angular/common';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import * as Sentry from "@sentry/angular";

import {CartState, UserState} from './core/store';

import {AppComponent} from './app.component';
import {PublicHeaderComponent} from './core/layout/public/header/public-header.component';
import {HomepageComponent} from './features/public/homepage/homepage.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {NotfoundpageComponent} from './features/notfoundpage/notfoundpage.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {JWTInterceptor} from './core/interceptors/jwt-interceptor.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {EventDatePipe} from './shared/pipes/eventpreview/EventDate.pipe';
import {GroupnamePipe} from './shared/pipes/account/groupname.pipe';

import {PublicRoutingComponent} from './features/public/public-routing.component';
import {PublicFooterComponent} from './core/layout/public/footer/public-footer.component';
import {CloudComponent} from './features/public/cloud/cloud.component';
import {
  RecSysItemPreviewComponent
} from './shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import {CardComponent} from './shared/components/account/card/card.component';
import {UnderConstructionComponent} from './shared/components/under-construction/under-construction.component';
import {ContactComponent} from './features/public/info/contact/contact.component';
import {CardRedirectComponent} from './features/public/card-redirect/card-redirect.component';
import {CreditsComponent} from './features/public/info/credits/credits.component';
import {ToastrModule} from 'ngx-toastr';
import {PartnerBalkComponent} from './shared/components/partners/partner-balk/partner-balk.component';
import {PartnerDumpComponent} from './shared/components/partners/partner-dump/partner-dump.component';
import {PartnerGridComponent} from './shared/components/partners/partner-grid/partner-grid.component';
import {GalabalComponent} from './features/public/custom-pages/galabal/galabal.component';
import {PromoListComponent} from './shared/components/items/item/promo-list/promo-list.component';
import {OAuthModule, OAuthStorage} from "angular-oauth2-oidc";

// Storage factory for OAuthModule
export function storageFactory(): OAuthStorage {
  console.log('storageFactory')
  return localStorage
}

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundpageComponent,
    PublicRoutingComponent,
    CloudComponent,
    EventDatePipe,
    GroupnamePipe,
    ContactComponent,
    CardRedirectComponent,
    CreditsComponent,
    GalabalComponent,
  ],
  exports: [
    EventDatePipe,
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule,
    PublicHeaderComponent,
    PublicFooterComponent,
    UnderConstructionComponent,
    AppRoutingModule,
    BrowserAnimationsModule,
    CardComponent,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    RecSysItemPreviewComponent,
    PartnerBalkComponent,
    PartnerDumpComponent,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    PartnerGridComponent,
    PromoListComponent,
    NgOptimizedImage,
    OAuthModule.forRoot(),
    NgxsModule.forRoot([UserState, CartState], {
      developmentMode: isDevMode(),
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !isDevMode(),
    })], providers: [
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
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
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
  ]
})
export class AppModule {
}
