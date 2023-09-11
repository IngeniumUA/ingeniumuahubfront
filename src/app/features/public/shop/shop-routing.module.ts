import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {ShopHomeComponent} from "./shop/shop-home.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {authGuard} from "../../../core/guards/auth/auth.guard";
import {PayComponent} from "./pay/pay.component";


const routes: Routes = [
  {path: '', component: ShopHomeComponent },
  {path: 'checkout', component: CheckoutComponent },
  {path: 'pay', component: PayComponent} // TODO canActivate: [authGuard]
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
