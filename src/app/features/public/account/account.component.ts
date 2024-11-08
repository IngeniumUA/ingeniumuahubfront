import { Component } from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from "@ingenium/app/core/store";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  roles$: Observable<UserRolesI|null>;

  constructor(private store: Store,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
    this.roles$ = this.store.select(UserState.roles);
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
