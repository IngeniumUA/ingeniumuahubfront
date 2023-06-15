import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopHomeComponent } from './shop/shop-home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {ShopRoutingModule} from "./shop-routing.module";


@NgModule({
  declarations: [
    ShopHomeComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
  ]
})
export class ShopModule { }
