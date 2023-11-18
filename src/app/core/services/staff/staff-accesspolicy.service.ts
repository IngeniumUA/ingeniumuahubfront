import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {StaffAccessPolicy} from "../../../shared/models/staff/staff_access_policy";

@Injectable({
  providedIn: 'root'
})
export class StaffAccessPolicyService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + "staff/access_policy";

  public getAccessPolicies(offset: number = 0, count: number = 50): Observable<StaffAccessPolicy[]> {
    let query_str = "?offset=" + offset.toString() + "&limit=" + count.toString()

    return this.httpClient.get<StaffAccessPolicy[]>(
      this.apiUrl + query_str)
  };

}
