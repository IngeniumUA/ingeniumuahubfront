import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/public/header/header.component';
import { HomepageComponent } from './features/homepage/homepage.component';
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NotfoundpageComponent } from './features/notfoundpage/notfoundpage.component';
import { RecsysComponent } from './features/recsys/recsys.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundpageComponent,
    RecsysComponent
  ],
  imports: [
    BrowserModule,
    HeaderComponent,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
