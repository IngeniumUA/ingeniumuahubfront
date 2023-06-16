import {Component} from '@angular/core';
import {CartService} from "../../../../../core/services/shop/cart/cart.service";
import {NgForOf} from "@angular/common";
import {CartSection} from "../../../../models/items/products/cart";

@Component({
  selector: 'app-shoppingcart-list',
  templateUrl: './shoppingcart-list.component.html',
  styleUrls: ['./shoppingcart-list.component.css'],
  imports: [
    NgForOf
  ],
  standalone: true
})
export class ShoppingcartListComponent {
  cartSections: CartSection[] = this.cartService.cartSections;

  constructor(private cartService: CartService) {

  }
}
