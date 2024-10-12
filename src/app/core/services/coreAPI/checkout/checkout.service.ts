import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {CheckoutI, CheckoutPatchI} from "@ingenium/app/shared/models/checkout/checkoutModels";
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
                        user_email: string | null = null,
                        checkout_id: string | null = null): Observable<CheckoutI[]> {
    const param = {
      offset: offset,
      limit: count,
      item: item,
      user: user,
      checkout_status: status,
      user_email: user_email,
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

  public patchCheckout(checkout_id: string, patchObj: CheckoutPatchI) {
    return this.httpClient.patch<CheckoutI>(this.apiUrl + '/' + checkout_id, patchObj);
  }
}
