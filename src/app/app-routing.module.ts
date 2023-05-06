import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from "./features/homepage/homepage.component";
import {NotfoundpageComponent} from "./features/notfoundpage/notfoundpage.component";


const routes: Routes = [
  // Public pages
  {path: '', component: HomepageComponent },

  /*
  {
  path: 'user',
  loadChildren: () =>
    import('...).then((m) => m.UserModule}, https://devooti.com/responsive-navbar-with-angular/
  */

  // Not found as last
  {path: '**', component: NotfoundpageComponent}
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
