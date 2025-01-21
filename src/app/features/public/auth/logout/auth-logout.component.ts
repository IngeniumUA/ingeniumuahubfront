import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User, UserState} from "@ingenium/app/core/store";
import { PublicHeaderComponent } from '../../../../core/layout/public/header/public-header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page',
    templateUrl: './auth-logout.component.html',
    imports: [PublicHeaderComponent, RouterLink]
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
