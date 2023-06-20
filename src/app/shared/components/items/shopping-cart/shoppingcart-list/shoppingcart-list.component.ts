import {Component} from '@angular/core';
import {CartService} from "../../../../../core/services/shop/cart/cart.service";
import {NgForOf, NgIf} from "@angular/common";
import {ITransaction} from "../../../../models/items/products/cart";
import {ProductComponent} from "../../products/product/product.component";
import {IProductGroupInfo, IProductItem} from "../../../../models/items/products/products";
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
export class ShoppingcartListComponent {
  transactions: ITransaction[] = this.cartService.getTransactions();

  constructor(private cartService: CartService) {
  }

  SetProductCount(source: IItem, groupinfo: IProductGroupInfo, product: IProductItem, count: number): void {
    this.cartService.setProductCount(source, groupinfo, product, count);

    if (count < 1) this.transactions = this.cartService.getTransactions();
  }
}
