import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PricePolicyI} from '../../../../models/price_policy';
import {AllowDenyListComponent} from '../access-policy/access_policies/allow-deny-list/allow-deny-list.component';
import {DatePipe, NgIf, TitleCasePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availability_composition";
import {AccessPolicyEnum, CastToMemberOfGroupPipe} from "@ingenium/app/shared/models/access_policies/access_policies";

@Component({
  selector: 'app-price-policy',
  templateUrl: './price-policy.component.html',
  styleUrls: ['./price-policy.component.css'],
  imports: [
    AllowDenyListComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    CastToMemberOfGroupPipe,
    TitleCasePipe
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
    this.pricePolicyForm = this.formBuilder.group({
      priceControl: [this.pricePolicy.price, Validators.required],
      productNameControl: [this.pricePolicy.name],
      alwaysAvailableControl: [this.pricePolicy.always_display],
      allowInvalidAccessControl: [this.pricePolicy.allow_invalid_access]
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  public UpdateContent(content: any) {
    // this.pricePolicy.access_policy.content = content;

    if (this.pricePolicyForm.invalid) {
      const error: Error = Error('Invalid form');
      this.handleFormError(error);
      return;  }

    this.UpdatePricePolicyEvent.emit(this.pricePolicy);
  }

  public RemovePricePolicy() {
    this.RemovePricePolicyEvent.emit(this.pricePolicy);
  }

  public SavePricePolicy() {
    const availability: AvailabilityCompositionI = {
      available: true,
      disabled: false,
      dynamic_policy_type: this.pricePolicy.availability.dynamic_policy_type,
      dynamic_policy_content: this.pricePolicy.availability.dynamic_policy_content
    }

    const nameControlValue: string | null = this.pricePolicyForm.get('productNameControl')!.value
    const name = nameControlValue === null || nameControlValue === '' ? null: nameControlValue;

    const pricePolicy: PricePolicyI = {
      id: this.pricePolicy.id,
      product_blueprint_id: this.pricePolicy.product_blueprint_id,
      availability: availability,

      name: name,
      price: this.pricePolicyForm.controls['priceControl'].value,
      always_display: this.pricePolicyForm.controls['alwaysAvailableControl'].value,
      allow_invalid_access: this.pricePolicyForm.controls['allowInvalidAccessControl'].value,
    };
    this.UpdatePricePolicyEvent.emit(pricePolicy);
  }

  protected readonly AccessPolicyEnum = AccessPolicyEnum;
}
