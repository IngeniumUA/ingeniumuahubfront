import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from './features/public/homepage/homepage.component';
import {NotfoundpageComponent} from './features/notfoundpage/notfoundpage.component';
import {RecSysFormComponent} from './features/recsysform/rec-sys-form.component';
import {PublicRoutingComponent} from './features/public/public-routing.component';
import {CloudComponent} from './features/public/cloud/cloud.component';
import {authGuard} from './core/guards/auth/auth.guard';
import {EventsComponent} from './features/public/events/events/events.component';
import {staffGuard} from './core/guards/staff.guard';
import {CardRedirectComponent} from './features/public/card-redirect/card-redirect.component';
import { CreditsComponent } from 'src/app/features/public/info/credits/credits.component';
import {webmasterGuard} from './core/guards/webmaster.guard';
import {managerGuard} from './core/guards/manager.guard';


const routes: Routes = [
  // Homepages
  {path: '', component: HomepageComponent},
  {path: 'home', redirectTo: '/', pathMatch: "full"}, // For routing to homepage (makes it easier)
  {path: '',
    component: PublicRoutingComponent,
    children: [
      // Authentication pages
      {path: 'auth', loadChildren: () => import('src/app/features/public/auth/auth.model').then(x => x.AuthModule)},
      {path: 'login', redirectTo: 'auth/login', pathMatch: 'full'},
      {path: 'register', redirectTo: 'auth/register', pathMatch: 'full'},

      // Public event related pages
      {path: 'events', loadChildren: () => import('src/app/features/public/events/event.model').then(x => x.EventModule)},
      {path: 'event', redirectTo: 'events', pathMatch: 'prefix'},

      // Shop
      {path: 'shop', loadChildren: () => import('src/app/features/public/shop/shop.module').then(x => x.ShopModule)},

      // Info
      {path: 'info', loadChildren: () => import('src/app/features/public/info/info.module').then(x => x.InfoModule)},
      {path: 'over-ons', redirectTo: 'info', pathMatch: 'full'},
      {path: 'praesidium', redirectTo: 'info/praesidium', pathMatch: 'prefix'},
      {path: 'partners', redirectTo: 'info/partners', pathMatch: 'full'},
      {path: 'contact', redirectTo: 'info/contact', pathMatch: 'full'},
      {path: 'credits', component: CreditsComponent},

      // Cloud
      {path: 'cloud', component: CloudComponent, canActivate: [authGuard]},

      // Cardredirect
      {path: 'card/:id', component: CardRedirectComponent, canActivate: [authGuard]},

      // User specific pages
      {
        path: 'account',
        loadChildren: () => import('src/app/features/public/account/account.module').then(x => x.AccountModule),
        canActivate: [authGuard]
      },

      // Promo
      {path: '', loadChildren: () => import('src/app/features/public/promo/promo.module').then(x => x.PromoModule)},
    ]},

  // POP-UP Z
  /*
  { path: '',
    children: [
      { path: 'popupz', component: PopupzComponent },
      { path: 'popupzorder', component: PopupzorderComponent },
      { path: 'popupzorderstaff', component: PopupzorderStaffComponent },

      // { path: 'popupz/orders/drinks', component: DrinkOrdersComponent, canActivate: [staffGuard] },
      { path: 'popupz/orders/food', component: FoodOrdersComponent, canActivate: [staffGuard] },
    ]
  },
  */

  //** Employee **//

  { path: 'staff',
    loadChildren: () => import('src/app/features/staff/staff.module').then(x => x.StaffModule),
    canActivate: [staffGuard]
  },

  //** Webmaster **//
  { path: 'web',
    loadChildren: () => import('src/app/features/webmaster/webmaster.module').then(x => x.WebmasterModule),
    canActivate: [webmasterGuard]
  },

  //** Manager **//
  { path: 'man',
    loadChildren: () => import('src/app/features/manager/manager.module').then(x => x.ManagerModule),
    canActivate: [managerGuard]
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
