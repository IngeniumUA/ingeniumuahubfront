import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HubAccountData} from "../../../../shared/models/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HubaccountService {

  constructor(private httpClient: HttpClient) { }

  public getAccount(): Observable<HubAccountData> {
    return this.httpClient.get<HubAccountData>("https://ingeniumuahub.ew.r.appspot.com/api/user/account")
  }
}
