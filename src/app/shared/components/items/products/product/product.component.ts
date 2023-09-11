import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IProductItem} from "../../../../models/items/products/products";
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
  @Input() product!: IProductItem;
  @Input() onInitValue: number = 0;
  @Input() primaryColorFull!: string;
  @Input() primaryColorHalf!: string;
  @Output() countEvent: EventEmitter<number> = new EventEmitter<number>();

  productForm = this.formBuilder.group({
    count: [0, Validators.min(0)]
    });
  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    // Set max validator dynamically because it depends on product interface (which needs to be loaded)
    this.productForm.get('count')?.addValidators(Validators.max(this.product.max_count));

    // Set initial value (which is saved in parent component
    this.productForm.patchValue({
      count: this.onInitValue
    })

    // Form input correction
    this.ValueChangePipeline();
  }

  ValueChangePipeline() {
    // Get count field and detect valuechange, then subscribe to every change
    this.productForm.get('count')?.valueChanges.pipe(
      takeUntil(this.ngUnsubscribe)) // Unsubscribe behaviour
      .subscribe((value: number | null) => {
        value = value ?? 0; // If null, set to 0

        this.countEvent.emit(value); // Emit Value

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

  StyleInput() {
    if ((this.productForm.controls.count.value ?? 0) > 0) {
      return {'text-decoration' :'underline 2px solid ' + this.primaryColorFull,
        '-webkit-text-decoration-color': this.primaryColorFull,
        '-webkit-text-decoration-thickness': '3px'}
    }
    return {'text-decoration' :'underline 2px solid gray',
      '-webkit-text-decoration-color': 'gray',
      '-webkit-text-decoration-thickness': '3px'}
  }

  private ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
