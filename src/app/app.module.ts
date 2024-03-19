import {NgModule, isDevMode} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {NgxsAfterBootstrap, NgxsModule, StateContext} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {QRCodeModule} from 'angularx-qrcode';

import {User, UserState} from './core/store';

import {AppComponent} from './app.component';
import {PublicHeaderComponent} from './core/layout/public/header/public-header.component';
import {HomepageComponent} from './features/public/homepage/homepage.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NotfoundpageComponent} from './features/notfoundpage/notfoundpage.component';
import {RecSysFormComponent} from './features/recsysform/rec-sys-form.component';
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
import {RegisterComponent} from './shared/components/auth/register/register.component';
import {GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule} from '@abacritt/angularx-social-login';
import {SetpwComponent} from './features/public/auth/setpw/setpw.component';
import {
  RecSysItemPreviewComponent
} from './shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import {CardComponent} from './shared/components/account/card/card.component';
import {UnderConstructionComponent} from './shared/components/under-construction/under-construction.component';
import {ContactComponent} from './features/public/info/contact/contact.component';
import {CardRedirectComponent} from './features/public/card-redirect/card-redirect.component';
import {AwaitpasswordLinkComponent} from './features/public/auth/awaitpassword-link/awaitpassword-link.component';
import {CreditsComponent} from './features/public/info/credits/credits.component';
import {PopupzComponent} from './features/public/popupz/popupz.component';
import {PopupzorderComponent} from './features/public/popupz/popupzorder/popupzorder.component';
import {PopupzorderStaffComponent} from './features/public/popupz/popupzorder-staff/popupzorder-staff.component';
import {ToastrModule} from 'ngx-toastr';
import {PartnerBalkComponent} from './shared/components/partners/partner-balk/partner-balk.component';
import {PartnerDumpComponent} from './shared/components/partners/partner-dump/partner-dump.component';
import {PartnerGridComponent} from './shared/components/partners/partner-grid/partner-grid.component';
import {GalabalComponent} from './features/public/custom-pages/galabal/galabal.component';
import {PromoListComponent} from './shared/components/items/item/promo-list/promo-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundpageComponent,
    RecSysFormComponent,

    PublicRoutingComponent,
    CloudComponent,

    EventDatePipe,
    GroupnamePipe,
    SetpwComponent,
    ContactComponent,
    CardRedirectComponent,
    AwaitpasswordLinkComponent,
    CreditsComponent,
    PopupzComponent,
    PopupzorderComponent,
    PopupzorderStaffComponent,
    GalabalComponent,
  ],
  imports: [
    // https://www.npmjs.com/package/angularx-qrcode
    // QRCode generator
    QRCodeModule,

    BrowserModule,
    PublicHeaderComponent,
    PublicFooterComponent,

    UnderConstructionComponent,

    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    CardComponent,

    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    RegisterComponent,
    RecSysItemPreviewComponent,

    PartnerBalkComponent,
    PartnerDumpComponent,

    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    PartnerGridComponent,
    PromoListComponent,
    NgOptimizedImage,

    NgxsModule.forRoot([UserState], {
      developmentMode: isDevMode(),
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !isDevMode(),
    }),
    /*NgxsStoragePluginModule.forRoot({
      key: 'auth.token'
    })*/
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('955811433543-a10u2jjmsatmruf7p8cf2d005higk2k5.apps.googleusercontent.com')
          }
        ]
      } as unknown as SocialAuthServiceConfig,
    }
  ],
  exports: [
    EventDatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule implements NgxsAfterBootstrap {
  ngxsAfterBootstrap(ctx: StateContext<any>): void {
    ctx.dispatch(new User.FetchUserDetails());
  }
}
