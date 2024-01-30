import {Component, EventEmitter, Output} from '@angular/core';
import {PricePolicyI} from "../../../../models/price_policy";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgForOf} from "@angular/common";

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
export class PricePolicyComponentCreate {

  @Output() UpdatePricePolicyEvent = new EventEmitter<PricePolicyI>()

  methods = ['allow_deny_list']

  constructor(private formBuilder: FormBuilder) {
  }

  form = this.formBuilder.group({
    price: [0, [Validators.required, Validators.min(0)]],
    method: ["", Validators.required]
  })
  form_error: string | null = null;

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Invalid form");
      this.handleFormError(error);
      return;
    }

    const pricePolicy: PricePolicyI = {
      price: this.form.controls['price'].value!,
      access_policy: {
        method: this.form.controls['method'].value!,
        content: {}
      },
      allow_invalid_access: false,
      always_available: false,
      update_fields: null
    }

    this.UpdatePricePolicyEvent.emit(pricePolicy)
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
