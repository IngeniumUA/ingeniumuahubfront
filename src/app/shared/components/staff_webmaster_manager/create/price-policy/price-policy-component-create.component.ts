import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PricePolicyInI} from '../../../../models/price_policy';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgForOf} from '@angular/common';
import {AvailabilityCompositionInI} from "@ingenium/app/shared/models/item/availability_composition";

@Component({
  selector: 'app-price-policy-create',
  templateUrl: './price-policy-component-create.component.html',
  styleUrls: ['./price-policy-component-create.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf
  ],
  standalone: true
})
export class PricePolicyComponentCreateComponent {

  @Input() product_blueprint_id!: number;
  @Output() CreatePricePolicyEvent = new EventEmitter<PricePolicyInI>();

  methods = ['allow_deny_list'];

  constructor(private formBuilder: FormBuilder) {
  }

  form = this.formBuilder.group({
    price: [0, [Validators.required, Validators.min(0)]],
    method: ['', Validators.required]
  });
  form_error: string | null = null;

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Invalid form');
      this.handleFormError(error);
      return;
    }

    const availability: AvailabilityCompositionInI = {
      available: true,
      disabled: false
    }

    const pricePolicy: PricePolicyInI = {
      name: "",
      product_blueprint_id: this.product_blueprint_id,
      price_eu: this.form.controls['price'].value!,
      // access_policy: {
      //   method: this.form.controls['method'].value!,
      //   content: {}
      // },
      allow_invalid_access: false,
      always_display: false,
      availability: availability
    };

    this.CreatePricePolicyEvent.emit(pricePolicy);
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
