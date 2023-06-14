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
    // Set max validator dynamically because it depends on product interface (which needs to be loaded)
    this.productForm.get('count')?.addValidators(Validators.max(this.product.max_count));

    // Form input correction
    this.InputCorrection()
  }

  InputCorrection() {
    // Get count field and detect valuechange, then subscribe to every change
    this.productForm.get('count')?.valueChanges.subscribe((value: number | null) => {
        value = value ?? 0; // If null, set to 0

        if (value < 0) { // Set to 0 if value is negative
          this.productForm.patchValue({
            count: 0
          })
        }

        if (this.product.max_count < value) { // Set to max_count if value is higher
          this.productForm.patchValue({
            count: this.product.max_count
          })
        }
      }
    )
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
