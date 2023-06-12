import {Component, Input, OnInit, Output} from '@angular/core';
import {ProductDataI} from "../../../../models/items/products";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
  ]
})
export class ProductComponent implements OnInit {
  @Input() product!: ProductDataI;
  @Input() primaryColorFull: string = "#0a1f44";
  @Output() selected: number = 4;

  ngOnInit() {
  }

  TryIncreaseCount(): void {

  }

  TryDecreaseCount(): void {

  }
}
