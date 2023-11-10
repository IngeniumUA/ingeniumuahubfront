import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {StaffUserDetailI} from "../../../shared/models/staff/staff_user_detail";
import {StaffTransactionI} from "../../../shared/models/staff/staff_transaction";

@Injectable({
  providedIn: 'root'
})
export class StaffTransactionService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + "staff/transaction";

  public getTransactions(offset: number = 0, count: number = 50,
                         item_id: string | null = null,
                         user_id: string | null = null,
                         status: string | null = null): Observable<StaffTransactionI[]> {
    let query_str = "?offset=" + offset.toString() + "&limit=" + count.toString()
    if (item_id !== null) {
      query_str += "&item_id="+item_id;
    }
    if (user_id !== null) {
      query_str += "&user_id="+user_id;
    }
    if (status !== null) {
      query_str += "&status="+status;
    }

    return this.httpClient.get<StaffTransactionI[]>(
      this.apiUrl + query_str)
  };

}
