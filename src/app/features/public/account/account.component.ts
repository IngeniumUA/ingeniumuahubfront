import { Component } from '@angular/core';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {UserState} from "@ingenium/app/core/store";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  roles$: Observable<string[]|null>;

  constructor(private store: Store,
              private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
    this.roles$ = this.store.select(UserState.roles);
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
