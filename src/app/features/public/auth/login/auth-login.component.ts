import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {User} from "@ingenium/app/core/store";
import {ActivatedRoute} from "@angular/router";
import { PublicHeaderComponent } from '../../../../core/layout/public/header/public-header.component';

@Component({
    selector: 'app-page',
    templateUrl: './auth-login.component.html',
    imports: [PublicHeaderComponent]
})
export class AuthLoginComponent implements OnInit {
  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    const nextPath = this.route.snapshot.queryParamMap.get('dest') ?? '/';
    this.store.dispatch(new User.Login(nextPath));
  }
}
