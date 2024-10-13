import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {StaffUserService} from '../../../../core/services/staff/staff-user-service';
import {Observable} from 'rxjs';
import {UserWideI} from '../../../../shared/models/user/userI';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private staffUserService: StaffUserService) {
  }

  $userDetail!: Observable<UserWideI>;
  user_id!: string;
  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return;
    }
    this.user_id = id;

    this.$userDetail = this.staffUserService.getUserWide(this.user_id);
  }

  RefetchUser(refetchUser: boolean) {
    if (!refetchUser) {
      return;
    }
    this.$userDetail = this.staffUserService.getUserWide(this.user_id);
  }
}
