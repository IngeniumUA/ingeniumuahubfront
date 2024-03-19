import { Component } from '@angular/core';
import {AccountService, TransactionI} from '../../../../core/services/user/account/account.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
//import {apiEnviroment} from '../../../../../environments/environment';

/*interface Order {
  order_no: number
  status: boolean
}*/

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent {
  constructor(private accountService: AccountService,
              private httpClient: HttpClient) {
  }

  transactions$: Observable<TransactionI[]> = this.accountService.getTransactions();

  //popUpZOrders$: Observable<Order[]> = this.httpClient.get<Order[]>(apiEnviroment.apiUrl + 'popup/cache/user');
}
