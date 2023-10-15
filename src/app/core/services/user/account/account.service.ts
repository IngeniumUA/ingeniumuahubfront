import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HubAccountData, HubUserPersonalDetailsI} from "../../../../shared/models/user";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";
import {HubCardI} from "../../../../shared/models/card";
import {IProductItem} from "../../../../shared/models/items/products/products";
import {CheckoutI} from "../../../../shared/components/items/interactions/checkout";

const TESTAccount = {
  email: "een.mail@domain.root"
}

export interface TransactionI {
  product: IProductItem
  count: number
  amount: number
  date_complete: string
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubAccountData> {
    return this.httpClient.get<HubAccountData>(apiEnviroment.apiEnv['apiUrl'] + "user/account/")
  }

  // Extra Account Details
  public getAccountDetails(details: HubUserPersonalDetailsI): Observable<HubUserPersonalDetailsI> {
    return this.httpClient.post<HubUserPersonalDetailsI>(apiEnviroment.apiEnv['apiUrl'] + "user/account/personal", details)
  }
  public createAccountDetails(details: HubUserPersonalDetailsI): Observable<HubUserPersonalDetailsI> {
    return this.httpClient.post<HubUserPersonalDetailsI>(apiEnviroment.apiEnv['apiUrl'] + "user/account/personal", details)
  }
  public updatePersonalDetails(details: HubUserPersonalDetailsI): Observable<HubUserPersonalDetailsI> {
    return this.httpClient.post<HubUserPersonalDetailsI>(apiEnviroment.apiEnv['apiUrl'] + "user/account/personal", details)
  }

  // -----

  public linkCard(card_uuid: string): Observable<HubCardI> {
    return this.httpClient.post<HubCardI>(apiEnviroment.apiEnv['apiUrl'] + "item/card/link/" + card_uuid, {})
  }

  public getTransactions(): Observable<CheckoutI[]> {
    return this.httpClient.get<CheckoutI[]>(apiEnviroment.apiEnv['apiUrl'] + "user/account/transactions")
  }
}
