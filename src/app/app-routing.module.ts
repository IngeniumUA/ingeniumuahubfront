import { NgModule } from '@angular/core';
import {RouterModule, Routes, TitleStrategy} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import {HomepageComponent} from './features/public/homepage/homepage.component';
import {NotfoundpageComponent} from './features/notfoundpage/notfoundpage.component';
import {PublicRoutingComponent} from './features/public/public-routing.component';
import {CloudComponent} from './features/public/cloud/cloud.component';
import {authGuard} from './core/guards/auth/auth.guard';
import {staffGuard} from './core/guards/staff.guard';
import {CardRedirectComponent} from './features/public/card-redirect/card-redirect.component';
import {webmasterGuard} from './core/guards/webmaster.guard';
import {managerGuard} from './core/guards/manager.guard';
import {TemplatePageTitleStrategy} from "@ingenium/app/shared/others/PageTitleStrategy";
import {WalletRedirectComponent} from "@ingenium/app/features/public/wallet-redirect/wallet-redirect.component";
import {GalabalComponent} from "@ingenium/app/features/public/custom-pages/galabal/galabal.component";

const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./pages/qr_scanner_pages/tabs_folder/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'prices',
    loadChildren: () => import('./pages/qr_scanner_pages/prices/prices.module').then(m => m.PricesPageModule)
  },
  {
    path: 'result',
    loadChildren: () => import('./pages/qr_scanner_pages/result/result.module').then(m => m.ResultPageModule)
  },
  // {
  //   path: 'blueprints',
  //   loadChildren: () => import('./pages/qr_scanner_pages/blueprints/blueprints.module').then(m => m.BlueprintsPageModule)
  // },

  {
    path: 'tabs_attendance',
    loadChildren: () => import('./pages/attendance_scanner_pages/tabs_folder/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'result_attendance',
    loadChildren: () => import('./pages/attendance_scanner_pages/result/result.module').then(m => m.ResultPageModule)
  },

  // Homepages
  {path: '', component: HomepageComponent},
  {path: 'home', redirectTo: '/', pathMatch: "full"}, // For routing to homepage (makes it easier)

  {path: 'auth', redirectTo: 'sub/auth', pathMatch: "prefix"},
  {path: 'events', redirectTo: 'sub/events', pathMatch: "prefix"},
  {path: 'info', redirectTo: 'sub/info', pathMatch: "prefix"},
  {path: 'shop', redirectTo: 'sub/shop', pathMatch: "prefix"},
  {path: 'cloud', redirectTo: 'sub/cloud', pathMatch: "prefix"},
  {path: 'account', redirectTo: 'sub/account', pathMatch: "prefix"},
  {path: 'card/:id', redirectTo: 'sub/card/:id', pathMatch: "prefix"},
  {path: 'sub',
    component: PublicRoutingComponent,
    children: [
      // Authentication pages
      {path: 'auth', loadChildren: () => import('@ingenium/app/features/public/auth/auth.module').then(x => x.AuthModule)},
      {path: 'login', redirectTo: 'sub/auth/login', pathMatch: 'full'},
      {path: 'logout', redirectTo: 'sub/auth/logout', pathMatch: 'full'},
      {path: 'callback', redirectTo: 'sub/auth/callback', pathMatch: 'full'},
      {path: 'register', redirectTo: 'sub/auth/register', pathMatch: 'full'},

      // Public event related pages
      {path: 'events', title: 'Events', loadChildren: () => import('src/app/features/public/events/event.model').then(x => x.EventModule)},
      {path: 'event', redirectTo: 'events', pathMatch: 'prefix'},

      // Shop
      {path: 'shop', title: 'Shop', loadChildren: () => import('src/app/features/public/shop/shop.module').then(x => x.ShopModule)},

      // Info
      {path: 'info', loadChildren: () => import('src/app/features/public/info/info.module').then(x => x.InfoModule)},
      {path: 'over-ons', redirectTo: 'sub/info', pathMatch: 'full'},
      {path: 'praesidium', redirectTo: 'sub/info/praesidium', pathMatch: 'prefix'},
      {path: 'partners', redirectTo: 'sub/info/partners', pathMatch: 'full'},
      {path: 'contact', redirectTo: 'sub/info/contact', pathMatch: 'full'},
      {path: 'credits', redirectTo: 'sub/info/credits', pathMatch: 'full'},
      {path: 'licences', redirectTo: 'sub/info/licences', pathMatch: 'full'},

      // Cloud
      {path: 'cloud', title: 'Cloud', component: CloudComponent, canActivate: [authGuard]},

      // Cardredirect
      {path: 'card/:id', component: CardRedirectComponent, canActivate: [authGuard]},

      // Walletredirect
      {path: 'wallet/:id', component: WalletRedirectComponent},

      // User specific pages
      {
        path: 'account',
        loadChildren: () => import('src/app/features/public/account/account.module').then(x => x.AccountModule),
        canActivate: [authGuard]
      },

      // Promo
      {path: '', loadChildren: () => import('src/app/features/public/promo/promo.module').then(x => x.PromoModule)},


    ]},

  //** Galabal **//
  {path: 'galabal', component: GalabalComponent},

  //** Popupz **//
  // {
  //   path: 'popupz',
  //   loadChildren: () => import('src/app/features/popupz/popupz.module').then(x => x.PopupzModule),
  // },
  // { path: 'popup', redirectTo: 'popupz', pathMatch: 'full' },

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
