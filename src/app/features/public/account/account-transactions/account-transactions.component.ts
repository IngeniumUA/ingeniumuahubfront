import { Component } from '@angular/core';
import {AccountService, TransactionI} from "../../../../core/services/user/account/account.service";
import {Observable, of} from "rxjs";
import {CheckoutI} from "../../../../shared/components/items/interactions/checkout";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";

interface Order {
  order_no: number
  status: boolean
}

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent {
  constructor(private accountService: AccountService,
              private httpClient: HttpClient) {
  }

  checkouts$: Observable<CheckoutI[]> = this.accountService.getTransactions()

  popUpZOrders$: Observable<Order[]> = this.httpClient.get<Order[]>(apiEnviroment.apiEnv['apiUrl'] + "popup/cache/user")
}
