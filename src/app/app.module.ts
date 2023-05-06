import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './core/layout/public/header/header.component';
import { HomepageComponent } from './features/homepage/homepage.component';
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { NotfoundpageComponent } from './features/notfoundpage/notfoundpage.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NotfoundpageComponent
  ],
  imports: [
    BrowserModule,
    HeaderComponent,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
