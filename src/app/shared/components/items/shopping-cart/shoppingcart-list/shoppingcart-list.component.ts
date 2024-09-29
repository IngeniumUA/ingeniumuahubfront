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
import {CartState} from "@ingenium/app/core/store";

@Component({
  selector: 'app-shoppingcart-list',
  templateUrl: './shoppingcart-list.component.html',
  styleUrls: ['./shoppingcart-list.component.css'],
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

  cartEmpty = true; //!this.cartService.hasTransactions();

  constructor(private store: Store, private cartService: CartService) {
    this.products$ = store.select(CartState.getProducts);
    this.totalPrice$ = store.select(CartState.getTotalPrice);
  }

  ngOnInit() {
    this.paymentErrors = this.cartService.getCurrentPaymentErrors();
    this.SetTransactions();
  }

  SetTransactions() {
    /*this.items = this.cartService.getUsedItems();
    this.transactions = [];
    this.items.map((value) => {
      this.transactions.push(this.cartService.getCurrentTransactions(value));
    });
    this.CalcBudget();
    this.cartEmpty = !this.cartService.hasTransactions();*/
  }

  SetProductCount(source: ItemLimitedI, product: IProductItem, count: number): void {
    this.cartService.setProductCount(source, product, count);
    this.SetTransactions();
  }

  CalcBudget() {
    let budget = 0;
    this.transactions.flat().map((value) => {
      budget += value.product.price_policy.price * value.count;
    });
    this.budget = budget;
  }

  protected readonly Array = Array;
}
