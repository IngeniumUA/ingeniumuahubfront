import {Component, Input, OnInit} from '@angular/core';
import {JsonPipe, NgIf, NgStyle} from "@angular/common";
import {AllowDenyListComponent} from "../access_policies/allow-deny-list/allow-deny-list.component";
import { FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {first} from "rxjs/operators";
import {StaffAccessPolicyI} from "../../../../../models/staff/staff_access_policy";
import {StaffAccessPolicyService} from "../../../../../../core/services/staff/staff-accesspolicy.service";

@Component({
  selector: 'app-access-policy-detail',
  templateUrl: './access-policy-detail.component.html',
  styleUrls: ['./access-policy-detail.component.css'],
  imports: [
    JsonPipe,
    NgIf,
    AllowDenyListComponent,
    ReactiveFormsModule,
    NgStyle
  ],
  standalone: true
})
export class AccessPolicyDetailComponent implements OnInit {
  @Input() accessPolicy!: StaffAccessPolicyI

  form_error: string | null = null;
  loading: boolean = false

  policyForm!: any;

  constructor(private formBuilder: FormBuilder,
              private staffAccessPolicyService: StaffAccessPolicyService) {
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  ngOnInit() {
    this.policyForm = this.formBuilder.group({
      name: [this.accessPolicy.name],
      description: [this.accessPolicy.description],
      is_disabled: [this.accessPolicy.is_disabled],
      method: [this.accessPolicy.method]
    })
  }

  onSubmit() {
    // Check if valid guardclause
    if (this.policyForm.invalid) {
      const error: Error = Error("Wrong email or password");
      this.handleFormError(error);
      return;  }

    this.loading = true;
    const product_obj: StaffAccessPolicyI = {
      id: this.accessPolicy.id,
      name: "",
      description: "",
      is_disabled: false,
      method: "",
      content: {},
    }
    this.staffAccessPolicyService.put(this.accessPolicy.id, product_obj).pipe(
      first()).subscribe({
      next: () => {
        // Succes
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    })
  }

  UpdateAccessPolicyMethod(methodContent: object) {
    this.accessPolicy.content = methodContent
  }
}
