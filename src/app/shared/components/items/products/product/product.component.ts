import {Component, Input, OnInit, Output} from '@angular/core';
import {ProductDataI} from "../../../../models/items/products";
import {NgIf, NgStyle} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    ReactiveFormsModule,
  ]
})
export class ProductComponent implements OnInit {
  @Input() product!: ProductDataI;
  @Input() primaryColorFull: string = "#0a1f44";
  @Output() selected: number = 4;

  productForm = this.formBuilder.group({
    count: [0, Validators.min(0)]
    });
  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
  }

  TryIncreaseCount(): void {
    this.productForm.patchValue({
      count: (this.productForm.get("count")!.value ?? 0) + 1
    })
  }

  TryDecreaseCount(): void {
    this.productForm.patchValue({
      count: (this.productForm.get("count")!.value ?? 0) - 1
    })
  }
}
