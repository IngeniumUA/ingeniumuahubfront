import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WebmasterComponent} from './webmaster.component';
import {GroupListComponent} from './user/group-list/group-list.component';
import {UsersListComponent} from './user/users-list/users-list.component';
import {ItemsOverviewPage} from './item/item-dashboard/items-overview-page.component';
import {ItemDashboardPage} from './item/item-detail-dashboard/item-dashboard-page.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';
import {CardsPage} from './item/card-dashboard/cards-page.component';
import {ProductWebmasterPageComponent} from './product/product-webmaster-page/product-webmaster-page.component';
import {CheckoutDetailComponent} from './checkout/checkout-detail/checkout-detail.component';
import {OrderTrackingComponent} from '@ingenium/app/features/webmaster/order-tracking/order-tracking.component';
import {
  CardPageComponent
} from "@ingenium/app/features/webmaster/item/card-item-dashboard/card-page.component";


const routes: Routes = [
  {path: '',
    component: WebmasterComponent,
    children: [
      {path: 'user', component: UsersListComponent},
      {path: 'user/:id', component: UserDetailComponent},
      {path: 'group', component: GroupListComponent},
      {path: 'item', component: ItemsOverviewPage},
      {path: 'item/:id', component: ItemDashboardPage},
      {path: 'card', component: CardsPage},
      {path: 'card/:id', component: CardPageComponent},
      {path: 'product/:id', component: ProductWebmasterPageComponent},
      // {path: 'checkout',},
      {path: 'checkout/:id', component: CheckoutDetailComponent},
      {path: 'tracking/:id', component: OrderTrackingComponent}
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebmasterRoutingModule { }
