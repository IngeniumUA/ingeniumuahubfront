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
import {InfoComponent} from "./features/public/info/info/info.component";
import {PraesidiumInfoComponent} from "./features/public/info/praesidium-info/praesidium-info.component";
import { CreditsComponent } from 'src/app/features/public/credits/credits.component';
import { PopupzComponent } from './features/public/popupz/popupz.component';
import {PopupzorderComponent} from "./features/public/popupz/popupzorder/popupzorder.component";
import {PopupzorderStaffComponent} from "./features/public/popupz/popupzorder-staff/popupzorder-staff.component";
import { DrinkOrdersComponent } from './features/staff/popupz/drink-orders/drink-orders.component';
import { FoodOrdersComponent } from './features/staff/popupz/food-orders/food-orders.component';


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

    // POP-UP Z
    { path: 'popupz', component: PopupzComponent },

    // Info
    {path: 'info', loadChildren: () => import('src/app/features/public/info/info.module').then(x => x.InfoModule)},
    {path: 'over-ons', component: InfoComponent},
    {path: 'praesidium', component: PraesidiumInfoComponent},
    { path: 'credits', component: CreditsComponent },

    // Cloud
    {path: 'cloud', component: CloudComponent, canActivate: [authGuard]},

    // Cardredirect
    {path: 'card/:id', component: CardRedirectComponent, canActivate: [authGuard]},

    // User specific pages
    {path: 'account',
      loadChildren: () => import('src/app/features/public/account/account.module').then(x => x.AccountModule),
      canActivate: [authGuard]},
  ]},

  { path: '',
    children: [
      { path: 'popupzorder', component: PopupzorderComponent },
      { path: 'popupzorderstaff', component: PopupzorderStaffComponent },

      { path: 'popupz/orders/drinks', component: DrinkOrdersComponent, canActivate: [authGuard] },
      { path: 'popupz/orders/food', component: FoodOrdersComponent, canActivate: [authGuard] },
    ]
  },

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
  { path: 'recsysform', component: RecSysFormComponent },

  // Not found as last
  { path: '**', component: NotfoundpageComponent }
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
