import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopHomeComponent } from './shop/shop-home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {ShopRoutingModule} from "./shop-routing.module";
import {
  ShoppingcartListComponent
} from "../../../shared/components/items/shopping-cart/shoppingcart-list/shoppingcart-list.component";
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";
import { PayComponent } from './pay/pay.component';


@NgModule({
  declarations: [
    ShopHomeComponent,
    CheckoutComponent,
    PayComponent,
  ],
    imports: [
        CommonModule,
        ShopRoutingModule,
        ShoppingcartListComponent,
        PublicHeaderComponent,
    ]
})
export class ShopModule { }
