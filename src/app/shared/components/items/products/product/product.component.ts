import {Component, Input, Output} from '@angular/core';
import {ProductDataI} from "../../../../models/items/products";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true
})
export class ProductComponent {
  @Input() product!: ProductDataI;

  @Output() selected: number = 4;
}
