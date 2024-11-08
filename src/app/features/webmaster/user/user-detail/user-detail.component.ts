import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {UserWideI} from '@ingenium/app/shared/models/user/userI';
import {UserService} from "@ingenium/app/core/services/coreAPI/user/user.service";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
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
