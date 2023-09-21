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
import {NgxStripeModule} from "ngx-stripe";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {UnderConstructionComponent} from "../../../shared/components/under-construction/under-construction.component";


@NgModule({
  declarations: [
    ShopHomeComponent,
    CheckoutComponent,
    PayComponent,
  ],
  imports: [
    CommonModule,
    NgxStripeModule.forRoot("pk_live_nJtVFe7oRy6CCy9EEK8OKeFu"),
    ShopRoutingModule,
    ShoppingcartListComponent,
    PublicHeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    UnderConstructionComponent,
  ]
})
export class ShopModule { }
