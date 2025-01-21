import { Component } from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from "@ingenium/app/core/store";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";

@Component({
    selector: 'app-page',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss'],
    standalone: false
})
export class AccountComponent {
  roles$: Observable<UserRolesI|null>;

  constructor(private store: Store) {
    this.roles$ = this.store.select(UserState.roles);
  }
}
