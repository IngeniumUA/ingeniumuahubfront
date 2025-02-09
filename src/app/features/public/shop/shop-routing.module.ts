import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {ShopHomeComponent} from './shop/shop-home.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {PayComponent} from './pay/pay.component';
import {ShopDetailComponent} from './shop-detail/shop-detail.component';
import {CheckoutConfirmComponent} from './checkout-confirm/checkout-confirm.component';


const routes: Routes = [
  {path: '', component: ShopHomeComponent },
  {path: 'checkout', component: CheckoutComponent },
  {path: 'confirm', component: CheckoutConfirmComponent},
  {path: 'pay', component: PayComponent},
  {path: ':id', component: ShopDetailComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
