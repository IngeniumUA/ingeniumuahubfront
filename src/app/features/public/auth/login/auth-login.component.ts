import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User} from "@ingenium/app/core/store";

@Component({
  selector: 'app-page',
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new User.Login());
  }
}
