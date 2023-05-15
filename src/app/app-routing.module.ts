import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from "./features/homepage/homepage.component";
import {NotfoundpageComponent} from "./features/notfoundpage/notfoundpage.component";
import {RecsysComponent} from "./features/recsys/recsys.component";
import {AccountComponent} from "./features/user/account.component";

const routes: Routes = [
  // Homepage
  {path: '', component: HomepageComponent },
  {path: 'home', component: HomepageComponent }, // For routing to homepage (makes it easier)

  // Authentication pages
  {path: 'auth', loadChildren: () => import('src/app/features/auth/auth.model').then(x => x.AuthModule)},
  // Public event related pages
  {path: 'event', loadChildren: () => import('src/app/features/events/event.model').then(x => x.EventModule)},
  // User specific pages
  {path: 'user', component: AccountComponent},

  //** Employee **//

  //** Webmaster **//

  //** Manager **//

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
