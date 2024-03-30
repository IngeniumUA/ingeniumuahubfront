import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {HubAccountData} from '@ingenium/app/shared/models/user';
import {Store} from "@ngxs/store";

@Component({
  selector: 'app-page',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent {
  account$: Observable<HubAccountData | null>;

  constructor(private store: Store) {
    this.account$ = this.store.select(state => state.user.userDetails);
  }
}
