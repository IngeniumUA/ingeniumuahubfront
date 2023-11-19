import {Component, Input} from '@angular/core';
import {StaffAccessPolicyI} from "../../../../models/staff/staff_access_policy";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-access-policy-detail',
  templateUrl: './access-policy-detail.component.html',
  styleUrls: ['./access-policy-detail.component.css'],
  imports: [
    JsonPipe
  ],
  standalone: true
})
export class AccessPolicyDetailComponent {
  @Input() accessPolicy!: StaffAccessPolicyI
}
