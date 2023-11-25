import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PricePolicyI} from "../../../../models/price_policy";
import {AccessPolicyDetailComponent} from "../access-policy/access-policy-detail/access-policy-detail.component";
import {AllowDenyListComponent} from "../access-policy/access_policies/allow-deny-list/allow-deny-list.component";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-price-policy',
  templateUrl: './price-policy.component.html',
  styleUrls: ['./price-policy.component.css'],
  imports: [
    AccessPolicyDetailComponent,
    AllowDenyListComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class PricePolicyComponent implements OnInit {

  @Input() pricePolicy!: PricePolicyI
  @Output() UpdatePricePolicyEvent = new EventEmitter<PricePolicyI>()

  constructor(private formBuilder: FormBuilder) {
  }

  form!: FormGroup
  form_error: string | null = null;
  loading: boolean = false
  ngOnInit() {
    this.form = this.formBuilder.group({
      price: [this.pricePolicy.price, Validators.required],
    })

    const pricePolicy: PricePolicyI = {
      price: this.form.controls['price'].value,
      update_fields: this.pricePolicy.update_fields,
      access_policy: this.pricePolicy.access_policy
    }

    this.UpdatePricePolicyEvent.emit(pricePolicy)
  }

  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Wrong email or password");
      this.handleFormError(error);
      return;  }

    this.UpdatePricePolicyEvent.emit(this.pricePolicy)

    this.loading = true;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  public UpdateContent(content: any) {
    this.pricePolicy.access_policy.content = content
  }
}
