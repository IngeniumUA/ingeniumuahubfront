import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ProductDataI} from "../../../../models/items/products";
import {NgIf, NgStyle} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

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
export class ProductComponent implements OnInit, OnDestroy {
  @Input() product!: ProductDataI;
  @Input() primaryColorFull: string = "#0a1f44";
  @Output() countEventEmitter: EventEmitter<number> = new EventEmitter<number>();

  productForm = this.formBuilder.group({
    count: [0, Validators.min(0)]
    });
  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    // Set max validator dynamically because it depends on product interface (which needs to be loaded)
    this.productForm.get('count')?.addValidators(Validators.max(this.product.max_count));

    // Form input correction
    this.ValueChangePipeline();
  }

  ValueChangePipeline() {
    // Get count field and detect valuechange, then subscribe to every change
    this.productForm.get('count')?.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe)) // Unsubscribe behaviour
      .subscribe((value: number | null) => {
        value = value ?? 0; // If null, set to 0

        this.countEventEmitter.emit(value); // Emit Value

        if (value < 0) { // Set to 0 if value is negative
          this.productForm.patchValue({
            count: 0
          })}
        if (this.product.max_count < value) { // Set to max_count if value is higher
          this.productForm.patchValue({
            count: this.product.max_count
          })}
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

  private ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
