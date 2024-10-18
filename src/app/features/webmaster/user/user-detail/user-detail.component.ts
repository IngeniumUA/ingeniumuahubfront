import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {UserWideI} from '../../../../shared/models/user/userI';
import {UserService} from "@ingenium/app/core/services/coreAPI/user/user.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService) {
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

    this.$userDetail = this.userService.getUserWide(this.user_id);
  }

  RefetchUser(refetchUser: boolean) {
    if (!refetchUser) {
      return;
    }
    this.$userDetail = this.userService.getUserWide(this.user_id);
  }
}
