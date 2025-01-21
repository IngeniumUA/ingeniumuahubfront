import {Component} from '@angular/core';
import {Store} from "@ngxs/store";
import { CardComponent } from '../../../../shared/components/account/card/card.component';
import { AccountInfoComponent } from '../../../../shared/components/account/account-details/account-info.component';

@Component({
    selector: 'app-page',
    templateUrl: './account-details.component.html',
    styleUrls: ['./account-details.component.css'],
    imports: [CardComponent, AccountInfoComponent]
})
export class AccountDetailsComponent {

  constructor(private store: Store) {

  }
}
