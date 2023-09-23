import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from "./features/public/homepage/homepage.component";
import {NotfoundpageComponent} from "./features/notfoundpage/notfoundpage.component";
import {RecSysFormComponent} from "./features/recsysform/rec-sys-form.component";
import {PublicRoutingComponent} from "./features/public/public-routing.component";
import {CloudComponent} from "./features/public/cloud/cloud.component";
import {authGuard} from "./core/guards/auth/auth.guard";
import {EventsComponent} from "./features/public/events/events/events.component";
import {staffGuard} from "./core/guards/staff.guard";
import {CardRedirectComponent} from "./features/public/card-redirect/card-redirect.component";


const routes: Routes = [
  // Homepages
  {path: '', component: HomepageComponent,},
  {path: 'home', component: HomepageComponent}, // For routing to homepage (makes it easier)
  {path: '',
  component: PublicRoutingComponent,
  children: [
    // Authentication pages
    {path: 'auth', loadChildren: () => import('src/app/features/public/auth/auth.model').then(x => x.AuthModule)},
    // Public event related pages
    {path: 'event', loadChildren: () => import('src/app/features/public/events/event.model').then(x => x.EventModule)},
    {path: 'events', component: EventsComponent },

    // Shop
    {path: 'shop', loadChildren: () => import('src/app/features/public/shop/shop.module').then(x => x.ShopModule)},

    // Info
    {path: 'info', loadChildren: () => import('src/app/features/public/info/info.module').then(x => x.InfoModule)},

    // Cloud
    {path: 'cloud', component: CloudComponent, canActivate: [authGuard]},

    // Cardredirect
    {path: 'card/:id', component: CardRedirectComponent, canActivate: [authGuard]},

    // User specific pages
    {path: 'account',
      loadChildren: () => import('src/app/features/public/account/account.module').then(x => x.AccountModule),
      canActivate: [authGuard]},
  ]},
  //** Employee **//

  { path: 'staff',
    loadChildren: () => import('src/app/features/staff/staff.module').then(x => x.StaffModule),
    canActivate: [staffGuard]
  },

  //** Webmaster **//
  { path: 'web',
    loadChildren: () => import('src/app/features/webmaster/webmaster.module').then(x => x.WebmasterModule),
    canActivate: [staffGuard]
  },

  //** Manager **//
  { path: 'man',
    loadChildren: () => import('src/app/features/manager/manager.module').then(x => x.ManagerModule),
    canActivate: [staffGuard]
  },

  // Temporary Recsysform
  {path: 'recsysform', component: RecSysFormComponent },

  // Not found as last
  {path: '**', component: NotfoundpageComponent}
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
