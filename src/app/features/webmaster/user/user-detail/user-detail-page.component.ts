import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {UserWideI} from '../../../../shared/models/user/userI';
import {UserService} from "@ingenium/app/core/services/coreAPI/user/user.service";
import { NgIf, AsyncPipe } from '@angular/common';
import { UserDetailComponent } from '../../../../shared/components/staff_webmaster_manager/details/staff-user-detail/user-detail.component';
import { CheckoutAndTransactionDashboardComponent } from '../../../../shared/components/staff_webmaster_manager/dashboards/checkout-and-transaction-dashboard/checkout-and-transaction-dashboard.component';
import { InteractionTableComponent } from '../../../../shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component';
import { CardTableComponent } from '../../../../shared/components/staff_webmaster_manager/tables/card-table/card-table.component';

@Component({
    selector: 'app-user-detail-page',
    templateUrl: './user-detail-page.component.html',
    styleUrls: ['./user-detail-page.component.css'],
    imports: [NgIf, UserDetailComponent, CheckoutAndTransactionDashboardComponent, InteractionTableComponent, CardTableComponent, AsyncPipe]
})
export class UserDetailPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService: UserService) {
  }

  $userDetail!: Observable<UserWideI>;
  user_id!: string;

  showCards: boolean = false;

  toggleShowCards(): void {
    this.showCards = !this.showCards;
  }

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
