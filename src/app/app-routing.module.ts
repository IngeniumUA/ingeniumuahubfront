import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from "./features/homepage/homepage.component";
import {NotfoundpageComponent} from "./features/notfoundpage/notfoundpage.component";
import {RecsysComponent} from "./features/recsys/recsys.component";
import {AccountComponent} from "./features/user/account.component";

const routes: Routes = [
  // Public pages
  {path: '', component: HomepageComponent },
  {path: 'home', component: HomepageComponent }, // For routing to homepage (makes it easier)

  {path: 'auth', loadChildren: () => import('src/app/features/auth/auth.model').then(x => x.AuthModule)},
  {path: 'user', component: AccountComponent},
  /*
  {
  path: 'user',
  loadChildren: () =>
    import('...).then((m) => m.UserModule}, https://devooti.com/responsive-navbar-with-angular/
  */

  // Temporary Recsysform
  {path: 'recsysform', component: RecsysComponent },

  // Not found as last
  {path: '**', component: NotfoundpageComponent}
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
