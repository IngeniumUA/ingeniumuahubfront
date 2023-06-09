import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HubAccountData} from "../../../../shared/models/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HubaccountService {
  baseUrl: string = "http://127.0.0.1:8000/";
  // baseUrl: string = "https://ingeniumuahub.ew.r.appspot.com/";
  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubAccountData> {
    return this.httpClient.get<HubAccountData>(this.baseUrl + "api/user/account")
  }
}
