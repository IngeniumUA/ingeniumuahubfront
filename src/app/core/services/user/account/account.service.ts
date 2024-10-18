import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {TransactionLimitedI} from "@ingenium/app/shared/models/transaction/transactionModels";
import {AccountI} from "@ingenium/app/shared/models/user/accountI";
import {CardItemWideLimitedI} from "@ingenium/app/shared/models/item/cardI";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<AccountI> {
    return this.httpClient.get<AccountI>(apiEnviroment.apiUrl + 'account');
  }

  public updatePersonalDetails(details: AccountI): Observable<AccountI> {
    return this.httpClient.put<AccountI>(apiEnviroment.apiUrl + 'account', details);
  }

  // -----

  public getCard() {
    return this.httpClient.get<CardItemWideLimitedI>(apiEnviroment.apiUrl + 'account/card');
  }

  public linkCard(card_uuid: string): Observable<CardItemWideLimitedI> {
    return this.httpClient.get<CardItemWideLimitedI>(apiEnviroment.apiUrl + 'card/' + card_uuid);
  }

  public getTransactions(): Observable<TransactionLimitedI[]> {
    return this.httpClient.get<TransactionLimitedI[]>(apiEnviroment.apiUrl + 'account/transactions');
  }
}
