import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PricePolicyI} from '../../../../models/price_policy';
import {AccessPolicyDetailComponent} from '../access-policy/access-policy-detail/access-policy-detail.component';
import {AllowDenyListComponent} from '../access-policy/access_policies/allow-deny-list/allow-deny-list.component';
import {DatePipe, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {debounceTime, delay} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-price-policy',
  templateUrl: './price-policy.component.html',
  styleUrls: ['./price-policy.component.css'],
  imports: [
    AccessPolicyDetailComponent,
    AllowDenyListComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  standalone: true
})
export class PricePolicyComponent implements OnInit {

  @Input() pricePolicy!: PricePolicyI;
  @Output() UpdatePricePolicyEvent = new EventEmitter<PricePolicyI>();
  @Output() RemovePricePolicyEvent = new EventEmitter<PricePolicyI>();

  constructor(private formBuilder: FormBuilder) {
  }

  pricePolicyForm!: FormGroup;
  form_error: string | null = null;
  loading: boolean = false;
  ngOnInit() {
    const hasUpdateFields = this.pricePolicy.update_fields !== null;
    const productName = hasUpdateFields ? this.pricePolicy.update_fields!['product_name']: null;

    this.pricePolicyForm = this.formBuilder.group({
      priceControl: [this.pricePolicy.price, Validators.required],
      productNameControl: [productName],
      alwaysAvailableControl: [this.pricePolicy.always_available],
      allowInvalidAccessControl: [this.pricePolicy.allow_invalid_access]
    });

    this.pricePolicyForm.valueChanges.pipe(
      delay(500),
      distinctUntilChanged((prev, next) => prev.emailControl === next.emailControl),
      debounceTime(500)
    ).subscribe(_ => {
      const update_fields: { [key: string]: any } = {};

      const productNameControlValue = this.pricePolicyForm.get('productNameControl')!.value;
      const productName = productNameControlValue === '' ? null: productNameControlValue;

      if (productName !== null) {
        update_fields['product_name'] = productName;
      }

      // TODO remove update fields if empty

      const pricePolicy: PricePolicyI = {
        price: this.pricePolicyForm.controls['priceControl'].value,
        always_available: this.pricePolicyForm.controls['alwaysAvailableControl'].value,
        allow_invalid_access: this.pricePolicyForm.controls['allowInvalidAccessControl'].value,
        update_fields: update_fields,
        access_policy: this.pricePolicy.access_policy
      };
      this.UpdatePricePolicyEvent.emit(pricePolicy);
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  public UpdateContent(content: any) {
    this.pricePolicy.access_policy.content = content;

    if (this.pricePolicyForm.invalid) {
      const error: Error = Error('Invalid form');
      this.handleFormError(error);
      return;  }

    this.UpdatePricePolicyEvent.emit(this.pricePolicy);
  }

  public RemovePricePolicy() {
    this.RemovePricePolicyEvent.emit();
  }
}
