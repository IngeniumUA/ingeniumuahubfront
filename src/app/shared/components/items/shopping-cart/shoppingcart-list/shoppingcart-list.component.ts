import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../../../core/services/shop/cart/cart.service";
import {NgForOf, NgIf} from "@angular/common";
import {ITransaction} from "../../../../models/items/products/cart";
import {ProductComponent} from "../../products/product/product.component";
import {IProductItem} from "../../../../models/items/products/products";
import {IItem} from "../../../../models/items/IItem";
import {RouterLink} from "@angular/router";

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
  items: IItem[] = [];
  budget: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.SetTransactions();
  }

  SetTransactions() {
    this.items = this.cartService.getUsedItems();
    this.transactions = [];
    this.items.map((value) => {
      this.transactions.push(this.cartService.getCurrentTransactions(value));
    });
    this.CalcBudget();
  }

  SetProductCount(source: IItem, product: IProductItem, count: number): void {
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
