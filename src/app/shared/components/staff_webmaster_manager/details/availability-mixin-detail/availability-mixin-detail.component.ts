import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {AccessPolicyI, AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, TitleCasePipe} from "@angular/common";
import {
  AccessPoliciesList,
  AccessPolicyEnum,
  CastAccessKeyPipe,
  CastToMemberOfGroupPipe
} from "@ingenium/app/shared/models/access_policies/accessPolicyI";
import {
  AllowDenyListComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/details/access-policy/access_policies/allow-deny-list/allow-deny-list.component";
import {ValidityEnum, ValidityList} from "@ingenium/app/shared/models/payment/transaction/validityEnum";
import {
  AccessKeyComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/details/access-policy/access-key/access-key.component";

@Component({
  selector: 'app-availability-mixin-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AllowDenyListComponent,
    CastToMemberOfGroupPipe,
    NgForOf,
    AccessKeyComponent,
    CastAccessKeyPipe,
    TitleCasePipe
  ],
  templateUrl: './availability-mixin-detail.component.html',
  styleUrl: './availability-mixin-detail.component.scss'
})
export class AvailabilityMixinDetailComponent implements OnInit {

  @Input() availability!: AvailabilityCompositionI;
  @Output() public availabilityUpdated = new EventEmitter<AvailabilityCompositionI>();

  constructor(private formBuilder: FormBuilder) {}

  form!: FormGroup;

  currentPolicy!: AccessPolicyEnum;

  ngOnInit() {
    this.currentPolicy = this.availability.dynamic_policy_type === null ? AccessPolicyEnum.always_available: this.availability.dynamic_policy_type;

    this.form = this.formBuilder.group({
      available: new FormControl(this.availability.available, [Validators.required]),
      available_from: new FormControl(this.availability.available_from),
      available_until: new FormControl(this.availability.available_until),
      dynamic_policy_type: new FormControl(this.availability.dynamic_policy_type === null ? AccessPolicyEnum.always_available : this.availability.dynamic_policy_type),
    });

    this.form.valueChanges.subscribe((val: AvailabilityCompositionI) => {
      this.formUpdate(val)
    });
  }

  formUpdate(val: AvailabilityCompositionI) {
    if (this.availability.dynamic_policy_type !== val.dynamic_policy_type) {
      this.availability.dynamic_policy_type = val.dynamic_policy_type
      this.currentPolicy = val.dynamic_policy_type === null? AccessPolicyEnum.always_available: val.dynamic_policy_type;
    }

    const dynamicPolicyType = this.availability.dynamic_policy_type === AccessPolicyEnum.always_available ? null: this.availability.dynamic_policy_type;
    const dynamicPolicyContent = this.availability.dynamic_policy_type === AccessPolicyEnum.always_available ? null: val.dynamic_policy_content;

    const putModel: AvailabilityCompositionI = {
      available: val.available,
      available_from: val.available_from === '' ? null : val.available_from,
      available_until: val.available_until === '' ? null : val.available_until,
      disabled: false,
      dynamic_policy_type: dynamicPolicyType,
      dynamic_policy_content: dynamicPolicyContent
    }
    this.availabilityUpdated.emit(putModel);
  }

  updateAccessPolicy(dynamicPolicyContent: AccessPolicyI) {
    const putModel: AvailabilityCompositionI = {
      available: this.availability.available,
      available_from: this.availability.available_from === '' ? null : this.availability.available_from,
      available_until: this.availability.available_until === '' ? null : this.availability.available_until,
      disabled: false,
      dynamic_policy_type: this.availability.dynamic_policy_type,
      dynamic_policy_content: dynamicPolicyContent
    }
    this.availabilityUpdated.emit(putModel);
  }

  protected readonly AccessPolicyEnum = AccessPolicyEnum;
  protected readonly ValidityEnum = ValidityEnum;
  protected readonly AccessPoliciesList = AccessPoliciesList;
}
