import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PricePolicyInI} from '../../../../models/price_policy';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgForOf, TitleCasePipe} from '@angular/common';
import {AvailabilityCompositionInI} from "@ingenium/app/shared/models/item/availability_composition";
import {AccessPolicyEnum} from "@ingenium/app/shared/models/access_policies/access_policies";

@Component({
  selector: 'app-price-policy-create',
  templateUrl: './price-policy-component-create.component.html',
  styleUrls: ['./price-policy-component-create.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    TitleCasePipe
  ],
  standalone: true
})
export class PricePolicyComponentCreateComponent {

  @Input() product_blueprint_id!: number;
  @Output() CreatePricePolicyEvent = new EventEmitter<PricePolicyInI>();

  methods = [AccessPolicyEnum.always_available, AccessPolicyEnum.member_of_group];

  constructor(private formBuilder: FormBuilder) {
  }

  form = this.formBuilder.group({
    price: [0, [Validators.required, Validators.min(0)]],
    method: [AccessPolicyEnum.always_available, Validators.required]
  });
  form_error: string | null = null;

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Invalid form');
      this.handleFormError(error);
      return;
    }

    // Parsing availability
    const policyControlValue: number | null = this.form.get('method')!.value;
    const policy = policyControlValue === AccessPolicyEnum.always_available || policyControlValue === null ? null: policyControlValue

    const availability: AvailabilityCompositionInI = {
      available: true,
      disabled: false,
      dynamic_policy_type: policy,
      dynamic_policy_content: null
    }

    const pricePolicy: PricePolicyInI = {
      name: null,
      product_blueprint_id: this.product_blueprint_id,
      price_eu: this.form.controls['price'].value!,
      allow_invalid_access: false,
      always_display: false,
      availability: availability
    };

    this.CreatePricePolicyEvent.emit(pricePolicy);
    this.form_error = null
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  protected readonly AccessPolicyEnum = AccessPolicyEnum;
}
