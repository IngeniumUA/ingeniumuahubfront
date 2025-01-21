import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User, UserState} from "@ingenium/app/core/store";

@Component({
    selector: 'app-page',
    templateUrl: './auth-logout.component.html',
    standalone: false
})
export class AuthLogoutComponent implements OnInit {
  loggedOut = false;

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.store.selectSnapshot(UserState.isAuthenticated)) {
      this.store.dispatch(new User.Logout());
      return;
    }

    this.loggedOut = true;
  }
}
