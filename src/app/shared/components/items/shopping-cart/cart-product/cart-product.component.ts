import {Component, Input} from '@angular/core';
import {IProductItem} from "../../../../models/items/products/products";

@Component({
  selector: 'app-cart-product',
  templateUrl: './cart-product.component.html',
  styleUrls: ['./cart-product.component.css'],
  standalone: true
})
export class CartProductComponent {
  @Input() product!: [IProductItem, number];
}
