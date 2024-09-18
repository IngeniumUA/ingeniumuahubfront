import { Component } from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserRolesI} from '@ingenium/app/shared/models/user';
import {UserState} from "@ingenium/app/core/store";

@Component({
  selector: 'app-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  roles$: Observable<UserRolesI|null>;

  constructor(private store: Store) {
    this.roles$ = this.store.select(UserState.getRoles);
  }
}
