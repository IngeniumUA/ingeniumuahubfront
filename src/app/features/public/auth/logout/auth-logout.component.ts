import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User, UserState} from "@ingenium/app/core/store";
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";
import { InAppBrowser } from '@capacitor/inappbrowser';

@Component({
  selector: 'app-page',
  templateUrl: './auth-logout.component.html',
})
export class AuthLogoutComponent implements OnInit {
  loggedOut = false;

  constructor(private store: Store,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,) {}

  async ngOnInit() {
    if (this.store.selectSnapshot(UserState.isAuthenticated)) {
      this.store.dispatch(new User.Logout());
      return;
    }
    await InAppBrowser.close();

    this.loggedOut = true;
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }
}
