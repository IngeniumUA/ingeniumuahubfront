import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HubUserPersonalDetailsI} from '../../../../shared/models/user/user';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {CardLimitedI} from '@ingenium/app/shared/models/card';
import {CardItemI} from "@ingenium/app/shared/models/item/cardI";
import {TransactionLimitedI} from "@ingenium/app/shared/models/transaction/transactionModels";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubUserPersonalDetailsI> {
    return this.httpClient.get<HubUserPersonalDetailsI>(apiEnviroment.apiUrl + 'account');
  }

  public updatePersonalDetails(details: HubUserPersonalDetailsI): Observable<HubUserPersonalDetailsI> {
    return this.httpClient.put<HubUserPersonalDetailsI>(apiEnviroment.apiUrl + 'account', details);
  }

  // -----

  public getCard() {
    return this.httpClient.get<CardItemI>(apiEnviroment.apiUrl + 'account/card');
  }

  public linkCard(card_uuid: string): Observable<CardLimitedI> {
    return this.httpClient.get<CardLimitedI>(apiEnviroment.apiUrl + 'card/' + card_uuid);
  }

  public getTransactions(): Observable<TransactionLimitedI[]> {
    return this.httpClient.get<TransactionLimitedI[]>(apiEnviroment.apiUrl + 'account/transactions');
  }
}
