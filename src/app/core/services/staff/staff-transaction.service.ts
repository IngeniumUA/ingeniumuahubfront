import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {StaffUserDetailI} from "../../../shared/models/staff/staff_user_detail";
import {StaffTransactionI} from "../../../shared/models/staff/staff_transaction";
import {StatusStatsI} from "../../../shared/models/stats/transactionStats";

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
                         checkout_id: string | null = null,
                         status: string | null = null,
                         user_email: string | null = null,
                         interaction_id: string | null = null,
                         product: string | null = null): Observable<StaffTransactionI[]> {
    let query_str = "?offset=" + offset.toString() + "&limit=" + count.toString()
    if (item_id !== null) {
      query_str += "&item_id="+item_id;
    }
    if (user_id !== null) {
      query_str += "&user_id="+user_id;
    }
    if (checkout_id !== null) {
      query_str += "&checkout_id="+checkout_id
    }
    if (status !== null) {
      query_str += "&transaction_status="+status.toUpperCase();
    }
    if (user_email !== null) {
      query_str += "&user_email="+user_email;
    }
    if (interaction_id !== null) {
      query_str += "&interaction_id="+interaction_id;
    }
    if (product !== null) {
      query_str += "&product=" + product
    }

    return this.httpClient.get<StaffTransactionI[]>(
      this.apiUrl + query_str)
  };

  public getTransactionStats(
                         item_id: string | null = null,
                         user_id: string | null = null,
                         checkout_id: string | null = null): Observable<StatusStatsI> {
    let query_str = "?"
    if (item_id !== null) {
      query_str += "&item_id="+item_id;
    }
    if (user_id !== null) {
      query_str += "&user_id="+user_id;
    }
    if (checkout_id !== null) {
      query_str += "&checkout_id="+checkout_id
    }

    return this.httpClient.get<StatusStatsI>(
      this.apiUrl + '/stats' + query_str)
  };

  public emailTransaction(transaction_id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(this.apiUrl + '/email/' + transaction_id.toString())
  }

}
