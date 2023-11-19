import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {StaffAccessPolicyI} from "../../../shared/models/staff/staff_access_policy";

@Injectable({
  providedIn: 'root'
})
export class StaffAccessPolicyService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + "staff/access_policy";

  public getAccessPolicies(offset: number = 0, count: number = 50): Observable<StaffAccessPolicyI[]> {
    let query_str = "?offset=" + offset.toString() + "&limit=" + count.toString()

    return this.httpClient.get<StaffAccessPolicyI[]>(
      this.apiUrl + query_str)
  };

  public getAccessPolicy(id: string): Observable<StaffAccessPolicyI> {
    return this.httpClient.get<StaffAccessPolicyI>(
      this.apiUrl + "/" + id)
  };

}
