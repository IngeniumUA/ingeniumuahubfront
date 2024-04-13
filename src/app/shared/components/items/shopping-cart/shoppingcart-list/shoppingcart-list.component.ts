import {Component, OnInit} from '@angular/core';
import {CartService} from '../../../../../core/services/shop/cart/cart.service';
import {NgForOf, NgIf} from '@angular/common';
import {ITransaction} from '../../../../models/items/products/cart';
import {ProductComponent} from '../../products/product/product.component';
import {IProductItem} from '../../../../models/items/products/products';
import {ItemI} from '../../../../models/items/ItemI';
import {RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-shoppingcart-list',
  templateUrl: './shoppingcart-list.component.html',
  styleUrls: ['./shoppingcart-list.component.css'],
  imports: [
    NgForOf,
    ProductComponent,
    NgIf,
    RouterLink,
  ],
  standalone: true
})
export class ShoppingcartListComponent implements OnInit {
  transactions: ITransaction[][] = [];
  items: ItemI[] = [];
  paymentErrors: HttpErrorResponse[] = [];
  budget: number = 0;

  cartEmpty = !this.cartService.hasTransactions();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.paymentErrors = this.cartService.getCurrentPaymentErrors();
    this.SetTransactions();
  }

  SetTransactions() {
    this.items = this.cartService.getUsedItems();
    this.transactions = [];
    this.items.map((value) => {
      this.transactions.push(this.cartService.getCurrentTransactions(value));
    });
    this.CalcBudget();
    this.cartEmpty = !this.cartService.hasTransactions();
  }

  SetProductCount(source: ItemI, product: IProductItem, count: number): void {
    this.cartService.setProductCount(source, product, count);
    this.SetTransactions();
  }

  CalcBudget() {
    let budget = 0;
    this.transactions.flat().map((value) => {
      budget += value.product.price_eu * value.count;
    });
    this.budget = budget;
  }

}
