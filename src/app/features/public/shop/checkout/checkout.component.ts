import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../../core/services/shop/cart/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  constructor(private cartService: CartService) {
  }
  ngOnInit() {
  }
}
