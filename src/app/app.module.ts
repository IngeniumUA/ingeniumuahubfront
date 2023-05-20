import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/public/header/header.component';
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

import { AccountComponent } from './features/public/user/account.component';
import { EventpreviewComponent } from './shared/components/items/event/eventpreview/eventpreview.component';
import {RecSysComponent} from "./shared/components/items/recsys/recsys/rec-sys.component";
import { EventdatePipe } from './shared/pipes/eventpreview/eventdate.pipe';
import { PublicRoutingComponent } from './features/public/public-routing/public-routing.component';

@NgModule({
    declarations: [
        AppComponent,
        HomepageComponent,
        NotfoundpageComponent,
        RecSysFormComponent,
        AccountComponent,
        EventpreviewComponent,
        RecSysComponent,
        EventdatePipe,
        PublicRoutingComponent,
    ],
  imports: [
    BrowserModule,
    HeaderComponent,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
