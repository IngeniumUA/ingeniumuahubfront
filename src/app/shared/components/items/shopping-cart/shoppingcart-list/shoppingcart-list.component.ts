import {Component, OnInit} from '@angular/core';
import {CartService} from '@ingenium/app/core/services/shop/cart/cart.service';
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {ITransaction} from '../../../../models/items/products/cart';
import {ProductComponent} from '../../products/product/product.component';
import {IProductItem, PaymentProviderEnum} from '../../../../models/items/products/products';
import {RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {CartActions, CartState, UserState} from "@ingenium/app/core/store";
import {map} from "rxjs/operators";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-shoppingcart-list',
  templateUrl: './shoppingcart-list.component.html',
  styleUrls: ['./shoppingcart-list.component.scss'],
  imports: [
    NgForOf,
    ProductComponent,
    NgIf,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule,
    KeyValuePipe,
  ],
  standalone: true
})
export class ShoppingcartListComponent implements OnInit {
  products$: Observable<IProductItem[]> = this.store.select(CartState.getProducts);
  totalPrice$: Observable<number> = this.store.select(CartState.getTotalPrice);
  allowStaffCheckout$ = this.store.select(UserState.roles).pipe(map(roles => roles && roles.is_manager));

  transactions: ITransaction[][] = [];
  items: ItemLimitedI[] = [];
  paymentErrors: HttpErrorResponse[] = [];

  constructor(private store: Store, private cartService: CartService) {}

  ngOnInit() {
    this.paymentErrors = this.cartService.getCurrentPaymentErrors();

    // Temporary, should be moved elsewhere
    if (this.store.selectSnapshot(UserState.roles)?.is_manager) {
      this.store.dispatch(new CartActions.SetPaymentMethod(PaymentProviderEnum.Kassa));
    }
  }

  removeProductFromCart(index: number) {
    this.store.dispatch(new CartActions.RemoveFromCart(index));
  }

  onStaffCheckoutClicked(event: Event) {
    // If checked then set the payment method to 'staff'
    if ((event.target as HTMLInputElement).checked) {
      this.store.dispatch(new CartActions.SetPaymentMethod(PaymentProviderEnum.Kassa));
    } else {
      this.store.dispatch(new CartActions.SetPaymentMethod(PaymentProviderEnum.Stripe));
    }
  }
}
