import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User} from "@ingenium/app/core/store";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-page',
  templateUrl: './auth-login.component.html',
})
export class AuthLoginComponent implements OnInit {
  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    const nextPath = this.route.snapshot.queryParamMap.get('dest') ?? '/';
    this.store.dispatch(new User.Login(nextPath));
  }
}
