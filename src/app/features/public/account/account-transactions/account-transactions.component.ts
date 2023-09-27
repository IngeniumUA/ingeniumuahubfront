import { Component } from '@angular/core';
import {AccountService, TransactionI} from "../../../../core/services/user/account/account.service";
import {Observable, of} from "rxjs";
import {CheckoutI} from "../../../../shared/components/items/interactions/checkout";

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.css']
})
export class AccountTransactionsComponent {
  constructor(private accountService: AccountService) {
  }

  checkouts$: Observable<CheckoutI[]> = this.accountService.getTransactions()
}
