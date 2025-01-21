import { Component } from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from "@ingenium/app/core/store";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import { PublicHeaderComponent } from '../../../core/layout/public/header/public-header.component';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-page',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    imports: [PublicHeaderComponent, RouterLinkActive, RouterLink, NgIf, RouterOutlet, AsyncPipe]
})
export class AccountComponent {
  roles$: Observable<UserRolesI|null>;

  constructor(private store: Store) {
    this.roles$ = this.store.select(UserState.roles);
  }
}
