import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PricePolicyI} from '../../../../models/price_policy';
import {AllowDenyListComponent} from '../access-policy/access_policies/allow-deny-list/allow-deny-list.component';
import {DatePipe, NgIf, TitleCasePipe} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {AccessPolicyEnum, CastToMemberOfGroupPipe} from "@ingenium/app/shared/models/access_policies/accessPolicyI";
import {
  AvailabilityMixinDetailComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/details/availability-mixin-detail/availability-mixin-detail.component";

@Component({
    selector: 'app-price-policy',
    templateUrl: './price-policy.component.html',
    styleUrls: ['./price-policy.component.scss'],
    imports: [
        AllowDenyListComponent,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        DatePipe,
        CastToMemberOfGroupPipe,
        TitleCasePipe,
        AvailabilityMixinDetailComponent
    ]
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
      orderingControl: [this.pricePolicy.ordering],
      alwaysAvailableControl: [this.pricePolicy.always_display],
      allowInvalidAccessControl: [this.pricePolicy.allow_invalid_access],
      allowUnauthenticatedAccessControl: [this.pricePolicy.allow_unauthenticated_access],
      maxValidUsagesControl: [this.pricePolicy.max_valid_usages],
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  public UpdateContent(content: any) {
    this.pricePolicy.availability.dynamic_policy_content = {
      access_policy_config: content
    };
  }

  updateAvailability(availabilityObj: AvailabilityCompositionI): void {
    this.pricePolicy.availability = availabilityObj;
  }

  public RemovePricePolicy() {
    this.RemovePricePolicyEvent.emit(this.pricePolicy);
  }

  public SavePricePolicy() {
    if (this.pricePolicyForm.invalid) {
      const error: Error = Error('Invalid form');
      this.handleFormError(error);
      return;  }

    const nameControlValue: string | null = this.pricePolicyForm.get('productNameControl')!.value
    const name = nameControlValue === null || nameControlValue === '' ? null: nameControlValue;

    const pricePolicy: PricePolicyI = {
      id: this.pricePolicy.id,
      product_blueprint_id: this.pricePolicy.product_blueprint_id,
      availability: this.pricePolicy.availability,

      name: name,
      ordering: parseInt(this.pricePolicyForm.get('orderingControl')!.value),
      price: this.pricePolicyForm.controls['priceControl'].value,
      always_display: this.pricePolicyForm.controls['alwaysAvailableControl'].value,
      allow_invalid_access: this.pricePolicyForm.controls['allowInvalidAccessControl'].value,
      allow_unauthenticated_access: this.pricePolicyForm.get('allowUnauthenticatedAccessControl')!.value,
      max_valid_usages: parseInt(this.pricePolicyForm.get('maxValidUsagesControl')!.value)
    };
    this.UpdatePricePolicyEvent.emit(pricePolicy);
  }

  protected readonly AccessPolicyEnum = AccessPolicyEnum;
}
