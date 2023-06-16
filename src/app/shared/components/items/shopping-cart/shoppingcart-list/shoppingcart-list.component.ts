import {Component} from '@angular/core';
import {CartService} from "../../../../../core/services/shop/cart/cart.service";
import {NgForOf} from "@angular/common";
import {CartSection} from "../../../../models/items/products/cart";
import {CartProductComponent} from "../cart-product/cart-product.component";
import {ProductComponent} from "../../products/product/product.component";
import {IProductGroupInfo, IProductItem} from "../../../../models/items/products/products";
import {IItem} from "../../../../models/items/IItem";

@Component({
  selector: 'app-shoppingcart-list',
  templateUrl: './shoppingcart-list.component.html',
  styleUrls: ['./shoppingcart-list.component.css'],
  imports: [
    NgForOf,
    CartProductComponent,
    ProductComponent
  ],
  standalone: true
})
export class ShoppingcartListComponent {
  cartSections: CartSection[] = this.cartService.cartSections;

  constructor(private cartService: CartService) {

  }
  SetProductCount(item: IItem, groupinfo: IProductGroupInfo, product: IProductItem, count: number) {
    this.cartService.setProductCount(item, groupinfo, product, count);
  }
}
