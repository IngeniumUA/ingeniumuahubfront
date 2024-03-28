import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '../../../../environments/environment';
import {StatusStatsI} from '../../../shared/models/stats/transactionStats';
import {StaffCheckoutI, StaffCheckoutPatchI, StaffCreateCheckoutI} from '../../../shared/models/staff/staff_checkout';

@Injectable({
  providedIn: 'root'
})
export class StaffCheckoutService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'staff/checkout';

  public getCheckouts(offset: number = 0, count: number = 50,
    item: string | null = null,
    user_id: string | null = null,
    status: string | null = null,
    user_email: string | null = null,
    checkout_id: string | null = null): Observable<StaffCheckoutI[]> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (item !== null) {
      query_str += '&item='+item;
    }
    if (user_id !== null) {
      query_str += '&user_id='+user_id;
    }
    if (status !== null) {
      query_str += '&checkout_status='+status.toUpperCase();
    }
    if (user_email !== null) {
      query_str += '&user_email='+user_email;
    }
    if (checkout_id !== null) {
      query_str += '&checkout_id=' + checkout_id;
    }

    return this.httpClient.get<StaffCheckoutI[]>(
      this.apiUrl + query_str);
  }

  public getCheckoutStats(
    item: string | null = null,
    user_id: string | null = null): Observable<StatusStatsI> {
    let query_str = '?';
    if (item !== null) {
      query_str += 'item='+item;
    }
    if (user_id !== null) {
      if (item !== null) {
        query_str += '&';  // Temp solution pending a better queryforming function
      }
      query_str += 'user_id='+user_id;
    }

    return this.httpClient.get<StatusStatsI>(
      this.apiUrl + '/stats' + query_str);
  }

  public patchCheckout(checkout_id: string, patchObj: StaffCheckoutPatchI): Observable<StaffCheckoutI> {
    return this.httpClient.patch<StaffCheckoutI>(this.apiUrl + '/' + checkout_id, patchObj);
  }

  public getCheckout(checkout_id: string): Observable<StaffCheckoutI> {
    return this.httpClient.get<StaffCheckoutI>(this.apiUrl + '/' + checkout_id);
  }

  public refundCheckout(checkout_id: string, forceRefund: boolean = false): Observable<StaffCheckoutI> {
    return this.httpClient.patch<StaffCheckoutI>(this.apiUrl + '/refund/' + checkout_id + '?force_refund=' + String(forceRefund), {});
  }

  public emailCheckout(checkout_id: string): Observable<boolean> {
    return this.httpClient.get<boolean>(this.apiUrl + '/email/' + checkout_id);
  }

  public createCheckout(checkoutObj: StaffCreateCheckoutI, forceCreate: boolean = false, sendMail: boolean = false, createMissingUser: boolean = false): Observable<StaffCheckoutI> {
    const createParams = '?force_create=' + String(forceCreate) + '&send_mail=' + String(sendMail) + '&create_user_if_none=' + String(createMissingUser);
    return this.httpClient.post<StaffCheckoutI>(this.apiUrl + createParams, checkoutObj);
  }
}
