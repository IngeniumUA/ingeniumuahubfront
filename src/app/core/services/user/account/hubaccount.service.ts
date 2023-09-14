import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HubAccountData} from "../../../../shared/models/user";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";

const TESTAccount = {
  email: "een.mail@domain.root"
}

@Injectable({
  providedIn: 'root'
})
export class HubaccountService {
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubAccountData> {
    return of(TESTAccount)
    // return this.httpClient.get<HubAccountData>(apiEnviroment.apiUrl + "user/account")
  }
}
