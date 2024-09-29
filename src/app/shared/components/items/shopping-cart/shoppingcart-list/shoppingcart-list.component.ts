import {Component, OnInit} from '@angular/core';
import {CartService} from '@ingenium/app/core/services/shop/cart/cart.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ITransaction} from '../../../../models/items/products/cart';
import {ProductComponent} from '../../products/product/product.component';
import {IProductItem} from '../../../../models/items/products/products';
import {RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {CartActions, CartState} from "@ingenium/app/core/store";

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
  ],
  standalone: true
})
export class ShoppingcartListComponent implements OnInit {
  products$: Observable<IProductItem[]>;
  totalPrice$: Observable<number>;

  transactions: ITransaction[][] = [];
  items: ItemLimitedI[] = [];
  paymentErrors: HttpErrorResponse[] = [];
  budget: number = 0;

  constructor(private store: Store, private cartService: CartService) {
    this.products$ = store.select(CartState.getProducts);
    this.totalPrice$ = store.select(CartState.getTotalPrice);
  }

  ngOnInit() {
    this.paymentErrors = this.cartService.getCurrentPaymentErrors();
  }

  removeProductFromCart(index: number) {
    this.store.dispatch(new CartActions.RemoveFromCart(index));
  }
}
