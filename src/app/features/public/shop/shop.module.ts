import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopHomeComponent } from './shop/shop-home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {ShopRoutingModule} from "./shop-routing.module";
import {
  ShoppingcartListComponent
} from "../../../shared/components/items/shopping-cart/shoppingcart-list/shoppingcart-list.component";


@NgModule({
  declarations: [
    ShopHomeComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    ShoppingcartListComponent,
  ]
})
export class ShopModule { }
