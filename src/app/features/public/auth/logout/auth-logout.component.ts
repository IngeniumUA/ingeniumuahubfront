import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User, UserState} from "@ingenium/app/core/store";
import {Browser} from "@capacitor/browser";
import {AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './auth-logout.component.html',
})
export class AuthLogoutComponent implements OnInit {
  loggedOut = false;

  constructor(private store: Store,
              private appFunctionsService: AppFunctionsService,) {}

  async ngOnInit() {
    if (this.store.selectSnapshot(UserState.isAuthenticated)) {
      this.store.dispatch(new User.Logout());
      return;
    }
    await Browser.close();

    this.loggedOut = true;
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}
}
