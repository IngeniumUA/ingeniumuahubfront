import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StaffUserService} from "../../../../core/services/staff/staff-user-service";
import {Observable} from "rxjs";
import {StaffUserDetailI} from "../../../../shared/models/staff/staff_user_detail";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private staffUserService: StaffUserService) {
  }

  $userDetail!: Observable<StaffUserDetailI>

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return
    }

    this.$userDetail = this.staffUserService.getUser(id)
  }

  RefetchUser(refetchUser: boolean) {
    if (!refetchUser) {
      return;
    }

    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      return
    }

    this.$userDetail = this.staffUserService.getUser(id)
  }
}
