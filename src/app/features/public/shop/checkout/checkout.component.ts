import {Component, OnInit} from '@angular/core';
import {ProductDataI} from "../../../../shared/models/items/products";
import {CartService} from "../../../../core/services/shop/cart/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  products: Array<[ProductDataI, number]> = this.cartService.getProducts();

  constructor(private cartService: CartService) {
  }
  ngOnInit() {
  }
}
