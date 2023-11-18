import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {StaffAccessPolicyI} from "../../../../shared/models/staff/staff_access_policy";
import {ActivatedRoute} from "@angular/router";
import {StaffAccessPolicyService} from "../../../../core/services/staff/staff-accesspolicy.service";

@Component({
  selector: 'app-access-policy-detail-dashboard',
  templateUrl: './access-policy-detail-dashboard.component.html',
  styleUrls: ['./access-policy-detail-dashboard.component.css']
})
export class AccessPolicyDetailDashboardComponent implements OnInit {
  accessPolicy$!: Observable<StaffAccessPolicyI>
  policyId!: string

  constructor(private route: ActivatedRoute,
              private accessPolicyService: StaffAccessPolicyService) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return
    }
    this.policyId= id


    this.accessPolicy$ = this.accessPolicyService.getAccessPolicy(this.policyId)
  }
}
