import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebmasterComponent} from './webmaster.component';
import {GroupListComponent} from '@ingenium/app/features/webmaster/group/group-list/group-list.component';
import {UsersListComponent} from './user/users-list/users-list.component';
import {ItemsOverviewPageComponent} from './item/item-dashboard/items-overview-page.component';
import {ItemDashboardPageComponent} from './item/item-detail-dashboard/item-dashboard-page.component';
import {UserDetailPageComponent} from './user/user-detail/user-detail-page.component';
import {CardsPageComponent} from './item/card-dashboard/cards-page.component';
import {ProductWebmasterPageComponent} from './product/product-webmaster-page/product-webmaster-page.component';
import {CheckoutDetailComponent} from './checkout/checkout-detail/checkout-detail.component';
import {OrderTrackingComponent} from '@ingenium/app/features/webmaster/order-tracking/order-tracking.component';
import {
  CardPageComponent
} from "@ingenium/app/features/webmaster/item/card-item-dashboard/card-page.component";
import {
  MediabucketFileListPageComponent
} from "@ingenium/app/features/webmaster/mediabucket-file-list-page/mediabucket-file-list-page.component";
import {
  AppNotificationsComponent
} from "@ingenium/app/features/webmaster/app-notifications/app-notifications.component";
import {GroupDetailPageComponent} from "@ingenium/app/features/webmaster/group/group-detail/group-detail-page.component";


const routes: Routes = [
  {path: '',
    component: WebmasterComponent,
    children: [
      {path: 'user', component: UsersListComponent},
      {path: 'user/:id', component: UserDetailPageComponent},
      {path: 'group', component: GroupListComponent},
      {path: 'group/:id', component: GroupDetailPageComponent},
      {path: 'item', component: ItemsOverviewPageComponent},
      {path: 'item/:id', component: ItemDashboardPageComponent},
      {path: 'card', component: CardsPageComponent},
      {path: 'card/:id', component: CardPageComponent},
      {path: 'product/:id', component: ProductWebmasterPageComponent},
      // {path: 'checkout',},
      {path: 'checkout/:id', component: CheckoutDetailComponent},
      {path: 'tracking/:id', component: OrderTrackingComponent},
      {path: 'file/media', component: MediabucketFileListPageComponent},
      {path: 'app_notifications', component: AppNotificationsComponent},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebmasterRoutingModule { }
