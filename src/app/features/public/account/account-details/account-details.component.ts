import {Component} from '@angular/core';
import {Store} from "@ngxs/store";

@Component({
  selector: 'app-page',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent {

  constructor(private store: Store) {

  }
}
