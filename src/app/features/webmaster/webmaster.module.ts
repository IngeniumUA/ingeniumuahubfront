import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { WebmasterComponent } from './webmaster.component';
import {WebmasterRoutingModule} from './webmaster-routing.module';
import {SidenavComponent} from '../../core/layout/behind/sidenav/sidenav.component';
import { UsersListComponent } from './user/users-list/users-list.component';
import { UserDetailPageComponent } from './user/user-detail/user-detail-page.component';
import { GroupListComponent } from '@ingenium/app/features/webmaster/group/group-list/group-list.component';
import {
  GroupTableComponent
} from '../../shared/components/staff_webmaster_manager/tables/group-table/group-table.component';
import {PublicHeaderComponent} from '../../core/layout/public/header/public-header.component';
import {
  UserTableComponent
} from '../../shared/components/staff_webmaster_manager/tables/user-table/user-table.component';
import { ItemsOverviewPageComponent } from './item/item-dashboard/items-overview-page.component';
import {
  ItemTableComponent
} from '../../shared/components/staff_webmaster_manager/tables/item-table/item-table.component';
import { ItemDashboardPageComponent } from './item/item-detail-dashboard/item-dashboard-page.component';
import {
  ItemDetailComponent
} from '../../shared/components/staff_webmaster_manager/details/staff-item-detail/item-detail.component';
import {
  UserDetailComponent
} from '../../shared/components/staff_webmaster_manager/details/staff-user-detail/user-detail.component';
import { CardsPageComponent } from './item/card-dashboard/cards-page.component';
import {
  CardTableComponent
} from '../../shared/components/staff_webmaster_manager/tables/card-table/card-table.component';
import {
  TransactionTableComponent
} from '../../shared/components/staff_webmaster_manager/tables/transaction-table/transaction-table.component';
import {
  ItemCreateComponent
} from '../../shared/components/staff_webmaster_manager/create/item-create/item-create.component';
import {
  ProductBlueprintDashboardComponent
} from '../../shared/components/staff_webmaster_manager/dashboards/product-blueprint-dashboard/product-blueprint-dashboard.component';
import {
  ProductBlueprintCreateComponent
} from '../../shared/components/staff_webmaster_manager/create/product-blueprint-create/product-blueprint-create.component';
import { ProductWebmasterPageComponent } from './product/product-webmaster-page/product-webmaster-page.component';
import {
  ProductBlueprintDetailComponent
} from '../../shared/components/staff_webmaster_manager/details/product-blueprint-detail/product-blueprint-detail.component';
import {
  CheckoutAndTransactionDashboardComponent
} from '../../shared/components/staff_webmaster_manager/dashboards/checkout-and-transaction-dashboard/checkout-and-transaction-dashboard.component';
import { CheckoutDetailComponent } from './checkout/checkout-detail/checkout-detail.component';
import {
  CreateCheckoutComponent
} from '../../shared/components/staff_webmaster_manager/create/create-checkout/create-checkout.component';
import {
  TransactionDetailComponent
} from '../../shared/components/staff_webmaster_manager/details/transaction-detail/transaction-detail.component';
import {
  OrderTrackingComponent
} from '@ingenium/app/features/webmaster/order-tracking/order-tracking.component';
import {CurrencyPipe} from "@ingenium/app/shared/pipes/currency.pipe";
import {
    InteractionTableComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component";
import {
    DeleteButtonComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/delete-button/delete-button.component";
import {
  CreateGroupComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/create/create-group/create-group.component";


@NgModule({
  declarations: [
    WebmasterComponent,
    UsersListComponent,
    UserDetailPageComponent,
    GroupListComponent,
    ItemsOverviewPageComponent,
    ItemDashboardPageComponent,
    CardsPageComponent,
    ProductWebmasterPageComponent,
    CheckoutDetailComponent,
    OrderTrackingComponent
  ],
  imports: [
    CommonModule,
    WebmasterRoutingModule,
    SidenavComponent,
    GroupTableComponent,
    PublicHeaderComponent,
    UserTableComponent,
    ItemTableComponent,
    ItemDetailComponent,
    UserDetailComponent,
    ProductBlueprintDashboardComponent,
    CardTableComponent,
    TransactionTableComponent,
    ItemCreateComponent,
    ProductBlueprintCreateComponent,
    ProductBlueprintDetailComponent,
    CheckoutAndTransactionDashboardComponent,
    CreateCheckoutComponent,
    TransactionDetailComponent,
    CurrencyPipe,
    InteractionTableComponent,
    DeleteButtonComponent,
    CreateGroupComponent
  ], providers: [
    DatePipe
  ]
})
export class WebmasterModule { }
