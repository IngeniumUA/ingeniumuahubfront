import {Component, Input} from '@angular/core';
import {StaffAccessPolicyI} from "../../../../models/staff/staff_access_policy";

@Component({
  selector: 'app-access-policy-detail',
  templateUrl: './access-policy-detail.component.html',
  styleUrls: ['./access-policy-detail.component.css'],
  standalone: true
})
export class AccessPolicyDetailComponent {
  @Input() accessPolicy!: StaffAccessPolicyI
}
