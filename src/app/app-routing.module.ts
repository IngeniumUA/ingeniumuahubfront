import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from "./features/public/homepage/homepage.component";
import {NotfoundpageComponent} from "./features/notfoundpage/notfoundpage.component";
import {RecSysFormComponent} from "./features/recsysform/rec-sys-form.component";
import {PublicRoutingComponent} from "./features/public/public-routing.component";
import {CloudComponent} from "./features/public/cloud/cloud.component";
import {authGuard} from "./core/guards/auth/auth.guard";

const routes: Routes = [
  {path: '',
  component: PublicRoutingComponent,
  children: [
    // Homepage
    {path: '', component: HomepageComponent },
    {path: 'home', component: HomepageComponent }, // For routing to homepage (makes it easier)

    // Authentication pages
    {path: 'auth', loadChildren: () => import('src/app/features/public/auth/auth.model').then(x => x.AuthModule)},
    // Public event related pages
    {path: 'event', loadChildren: () => import('src/app/features/public/events/event.model').then(x => x.EventModule)},

    // Shop
    {path: 'shop', loadChildren: () => import('src/app/features/public/shop/shop.module').then(x => x.ShopModule)},

    // Info
    {path: 'info', loadChildren: () => import('src/app/features/public/info/info.module').then(x => x.InfoModule)},

    // Cloud
    {path: 'cloud', component: CloudComponent, canActivate: [authGuard]},

    // User specific pages
    {path: 'account',
      loadChildren: () => import('src/app/features/public/account/account.module').then(x => x.AccountModule),
      canActivate: [authGuard]},
  ]},
  //** Employee **//

  { path: 'staff',
    loadChildren: () => import('src/app/features/staff/staff.module').then(x => x.StaffModule),
    canActivate: [authGuard]
  },

  //** Webmaster **//
  { path: 'web',
    loadChildren: () => import('src/app/features/webmaster/webmaster.module').then(x => x.WebmasterModule),
    canActivate: [authGuard]
  },

  //** Manager **//
  { path: 'man',
    loadChildren: () => import('src/app/features/manager/manager.module').then(x => x.ManagerModule),
    canActivate: [authGuard]
  },

  // Temporary Recsysform
  {path: 'recsysform', component: RecSysFormComponent },

  // Not found as last
  {path: '**', component: NotfoundpageComponent}
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
