import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PublicHeaderComponent } from './core/layout/public/header/public-header.component';
import { HomepageComponent } from './features/public/homepage/homepage.component';
import { AppRoutingModule } from "./app-routing.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NotfoundpageComponent } from './features/notfoundpage/notfoundpage.component';
import { RecSysFormComponent } from './features/recsysform/rec-sys-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {JWTInterceptor} from "./core/interceptors/jwt-interceptor.service";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { EventpreviewComponent } from './shared/components/items/event/eventpreview/eventpreview.component';
import { RecSysComponent } from "./shared/components/items/recsys/recsys/rec-sys.component";
import { EventdatePipe } from './shared/pipes/eventpreview/eventdate.pipe';
import {GroupnamePipe} from "./shared/pipes/account/groupname.pipe";

import { PublicRoutingComponent } from './features/public/public-routing.component';
import { PublicFooterComponent } from './core/layout/public/footer/public-footer.component';
import { CloudComponent } from './features/public/cloud/cloud.component';
import {AccountNavbarComponent} from "./shared/components/account/account-navbar/account-navbar.component";
import {RegisterComponent} from "./shared/components/auth/register/register.component";

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        NotfoundpageComponent,
        RecSysFormComponent,

        RecSysComponent,

        PublicRoutingComponent,
        CloudComponent,

        EventdatePipe,
        GroupnamePipe,
    ],
  imports: [
    BrowserModule,
    PublicHeaderComponent,
    PublicFooterComponent,

    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    AccountNavbarComponent,
    EventpreviewComponent,
    RegisterComponent,
  ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
    ],
    exports: [
        EventdatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
