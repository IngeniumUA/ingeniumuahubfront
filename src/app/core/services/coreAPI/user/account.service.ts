import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {TransactionLimitedI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {AccountI} from "@ingenium/app/shared/models/user/accountI";
import {CardItemWideLimitedI} from "@ingenium/app/shared/models/item/cardI";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

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

  public getCard() {
    return this.httpClient.get<CardItemWideLimitedI>(apiEnviroment.apiUrl + 'account/card');
  }

  public linkCard(card_uuid: string): Observable<CardItemWideLimitedI> {
    return this.httpClient.get<CardItemWideLimitedI>(apiEnviroment.apiUrl + 'card/' + card_uuid, {});
  }

  public getTransactions(): Observable<TransactionLimitedI[]> {
    return this.httpClient.get<TransactionLimitedI[]>(apiEnviroment.apiUrl + 'account/transactions');
  }

  public getWalletLinks(transaction_uuid: string,
                        banner_link: string,
                        event_name: string,
                        end_date: string,
                        start_date: string,
                        nummer: number,
                        locatie_naam: string,
                        platform: string): Observable<string>{
    const param = {
      transaction_uuid: transaction_uuid,
      banner_link: banner_link,
      event_name: event_name,
      end_date: end_date,
      start_date: start_date,
      nummer: nummer,
      locatie_naam: locatie_naam
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<string>(`${apiEnviroment.apiUrl}account/wallet/${platform}?${params.toString()}`);
  }
}
