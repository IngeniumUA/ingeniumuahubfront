import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HubAccountData} from "../../../../shared/models/user";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class HubaccountService {
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubAccountData> {
    return this.httpClient.get<HubAccountData>(apiEnviroment.apiUrl + "api/user/account")
  }
}
