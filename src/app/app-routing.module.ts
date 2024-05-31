import { NgModule } from '@angular/core';
import {RouterModule, Routes, TitleStrategy} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from './features/public/homepage/homepage.component';
import {NotfoundpageComponent} from './features/notfoundpage/notfoundpage.component';
import {RecSysFormComponent} from './features/recsysform/rec-sys-form.component';
import {PublicRoutingComponent} from './features/public/public-routing.component';
import {CloudComponent} from './features/public/cloud/cloud.component';
import {authGuard} from './core/guards/auth/auth.guard';
import {staffGuard} from './core/guards/staff.guard';
import {CardRedirectComponent} from './features/public/card-redirect/card-redirect.component';
import {webmasterGuard} from './core/guards/webmaster.guard';
import {managerGuard} from './core/guards/manager.guard';
import {TemplatePageTitleStrategy} from "@ingenium/app/shared/others/PageTitleStrategy";


const routes: Routes = [
  // Homepages
  {path: '', component: HomepageComponent},
  {path: 'home', redirectTo: '/', pathMatch: "full"}, // For routing to homepage (makes it easier)
  {path: '',
    component: PublicRoutingComponent,
    children: [
      // Authentication pages
      {path: 'auth', loadChildren: () => import('@ingenium/app/features/public/auth/auth.module').then(x => x.AuthModule)},
      {path: 'login', redirectTo: 'auth/login', pathMatch: 'full'},
      {path: 'register', redirectTo: 'auth/register', pathMatch: 'full'},

      // Public event related pages
      {path: 'events', title: 'Events', loadChildren: () => import('src/app/features/public/events/event.model').then(x => x.EventModule)},
      {path: 'event', redirectTo: 'events', pathMatch: 'prefix'},

      // Shop
      {path: 'shop', title: 'Shop', loadChildren: () => import('src/app/features/public/shop/shop.module').then(x => x.ShopModule)},

      // Info
      {path: 'info', loadChildren: () => import('src/app/features/public/info/info.module').then(x => x.InfoModule)},
      {path: 'over-ons', redirectTo: 'info', pathMatch: 'full'},
      {path: 'praesidium', redirectTo: 'info/praesidium', pathMatch: 'prefix'},
      {path: 'partners', redirectTo: 'info/partners', pathMatch: 'full'},
      {path: 'contact', redirectTo: 'info/contact', pathMatch: 'full'},
      {path: 'credits', redirectTo: 'info/credits', pathMatch: 'full'},

      // Cloud
      {path: 'cloud', title: 'Cloud', component: CloudComponent, canActivate: [authGuard]},

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
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    }
  ]
})
export class AppRoutingModule { }
