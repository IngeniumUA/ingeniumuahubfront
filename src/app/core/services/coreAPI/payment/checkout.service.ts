import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {CheckoutI, CheckoutInI, CheckoutPatchI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";
import {StatusStatsI} from "@ingenium/app/shared/models/stats/transactionStats";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'checkout';

  public queryCheckouts(offset: number = 0, count: number = 50,
                        item: number | null = null,
                        user: string | null = null,
                        status: PaymentStatusEnum | null = null,
                        checkout_id: string | null = null): Observable<CheckoutI[]> {
    const param = {
      offset: offset,
      limit: count,
      item: item,
      user: user,
      checkout_status: status,
      checkout_uuid: checkout_id
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<CheckoutI[]>(`${this.apiUrl}?${params.toString()}`);
  }



  public checkoutCountGroupByStatus(item: number | null = null,
                                    user: string | null = null,
                                    status: string | null = null,
                                    user_email: string | null = null,
                                    checkout_id: string | null = null): Observable<StatusStatsI> {
    const param = {
      item: item,
      user: user,
      checkout_status: status,
      user_email: user_email,
      checkout_uuid: checkout_id
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<StatusStatsI>(`${this.apiUrl}/group_by?${params.toString()}`);
  }

  public getCheckout(checkout_uuid: string): Observable<CheckoutI> {
    return this.httpClient.get<CheckoutI>(`${this.apiUrl}/${checkout_uuid}`);
  }

  public postCheckout(checkoutObj: CheckoutInI,
                      forceCreate: boolean = false,
                      sendMail: boolean = false,
                      createMissingUser: boolean = false
  ): Observable<CheckoutI> {
    const param = {
      force_create: forceCreate,
      send_mail: sendMail,
      create_user_if_none: createMissingUser,
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.post<CheckoutI>(`${this.apiUrl}?${params.toString()}`, checkoutObj);
  }

  public patchCheckout(checkout_id: string, patchObj: CheckoutPatchI) {
    return this.httpClient.patch<CheckoutI>(this.apiUrl + '/' + checkout_id, patchObj);
  }

  public emailCheckout(checkout_uuid: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/email/${checkout_uuid}`);
  }

  public refundCheckout(checkout_uuid: string, forceRefund: boolean = false): Observable<CheckoutI> {
    return this.httpClient.patch<CheckoutI>(`${this.apiUrl}/refund/${checkout_uuid}?force_refund=${String(forceRefund)}`, {});
  }
}
