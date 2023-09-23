import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HubAccountData, HubUserPersonalDetailsI} from "../../../../shared/models/user";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";
import {HubCardI} from "../../../../shared/models/card";

const TESTAccount = {
  email: "een.mail@domain.root"
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubAccountData> {
    return this.httpClient.get<HubAccountData>(apiEnviroment.apiUrl + "user/account/")
  }

  public updateAccountDetails(details: HubUserPersonalDetailsI): Observable<HubAccountData> {
    return this.httpClient.post<HubAccountData>(apiEnviroment.apiUrl + "user/account/", details)
  }

  public linkCard(card_uuid: string): Observable<HubCardI> {
    return this.httpClient.post<HubCardI>(apiEnviroment.apiUrl + "item/card/link/" + card_uuid, {})
  }
}
