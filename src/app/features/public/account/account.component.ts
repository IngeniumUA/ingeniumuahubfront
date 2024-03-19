import { Component } from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {HubAccountData} from '../../../shared/models/user';

@Component({
  selector: 'app-page',
  templateUrl: './account.component.html',
})
export class AccountComponent {

  constructor(private store: Store) {}

  user$: Observable<HubAccountData|null> = this.store.select(state => state.user.userDetails);

}
