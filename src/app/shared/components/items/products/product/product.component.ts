import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ProductOutI} from '../../../../models/product/products';
import {NgIf, NgStyle} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {CartActions, CartState} from "@ingenium/app/core/store";

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
  @Input() product!: ProductOutI;
  @Input() itemId: string | null = null;
  @Input() primaryColorFull!: string;
  @Input() primaryColorHalf!: string;

  formSubscription: Subscription|undefined;
  productForm = this.formBuilder.group({
    count: [0, Validators.min(0)]
  });

  constructor(private formBuilder: FormBuilder,
              private store: Store,
              private router: Router) {
  }

  ngOnInit() {
    // Set max validator dynamically because it depends on product interface (which needs to be loaded)
    this.productForm.get('count')?.addValidators(Validators.max(this.product.max_count));

    this.SetQuantityFromStore();
    this.ValueChangePipeline();
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  ValueChangePipeline() {
    // Get count field and detect valuechange, then subscribe to every change
    this.formSubscription = this.productForm.get('count')?.valueChanges
      .subscribe((value: number | null) => {
        // Take either 0 if lower, or max_count if higher
        value = Math.max(0, Math.min(value ?? 0, this.product.max_count));

        // Get the current product quantity and the difference between the given value
        const currentQuantity = this.store.selectSignal(CartState.getProductQuantity(this.product, true))()
        const delta = currentQuantity - value;
        if (delta === 0) return; // Don't do anything if it's equal

        // When our delta is smaller, we have requested more than are in our cart
        if (delta < 0) {
          this.store.dispatch(new CartActions.AddToCart(this.product, Math.abs(delta)));

        // When our delta is larger, there are more in our cart than requested
        } else if (delta > 0) {
          this.store.dispatch(new CartActions.ReduceProductQuantity(this.product, Math.abs(delta)));
        }
      });
  }

  TryIncreaseCount()  {
    this.store.dispatch(new CartActions.AddToCart(this.product));
    this.SetQuantityFromStore();
  }

  TryDecreaseCount()  {
    this.store.dispatch(new CartActions.ReduceProductQuantity(this.product));
    this.SetQuantityFromStore();
  }

  SetQuantityFromStore() {
    // We can use an observer. However, that may cause issues cuz we're also listening to the value changes from the
    // input field.
    this.PatchInputValue(
      this.store.selectSignal(CartState.getProductQuantity(this.product, true))()
    );
  }

  PatchInputValue(count: number = 0) {
    this.productForm.patchValue({ count });
  }

  StyleInput() {
    if ((this.productForm.controls.count.value ?? 0) > 0) {
      return {'text-decoration' :'underline 2px solid ' + this.primaryColorFull,
        '-webkit-text-decoration-color': this.primaryColorFull,
        '-webkit-text-decoration-thickness': '3px'};
    }
    return {'text-decoration' :'underline 2px solid gray',
      '-webkit-text-decoration-color': 'gray',
      '-webkit-text-decoration-thickness': '3px'};
  }

  ToLogin() {
    if (this.itemId === null) {
      this.router.navigateByUrl('/login?next=/event');
    } else {
      this.router.navigateByUrl('/login?next=/event/'+ this.itemId);
    }
  }

  protected readonly postMessage = postMessage;
}
