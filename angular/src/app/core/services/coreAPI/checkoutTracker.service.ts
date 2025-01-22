import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {HubCheckoutTrackerI} from "@ingenium/app/shared/models/tracker";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";


@Injectable({
  providedIn: 'root'
})
export class CheckoutTrackerService {
  constructor(private httpClient: HttpClient) {}

  apiUrl = apiEnviroment.apiUrl + 'checkout/tracker';

  public getTrackers(offset: number = 0, count: number = 50,
                     item: string | null = null,
                     tracker_status: string | number | null = null): Observable<HubCheckoutTrackerI[]> {
    /**
     * Fetches HubCheckoutTracker objects
     * @param item can both be item_name and item_uuid
     * @param tracker_status as either integer or correct string
     */
    const param = {
      offset: offset,
      limit: count,
      item: item,
      tracker_status: tracker_status,
      salt: (new Date()).getTime()  // Salt was required before -> to be tested without salt
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<HubCheckoutTrackerI[]>(`${this.apiUrl}?${params.toString()}`)
  }

  public nextStatus(checkout_id: string): Observable<HubCheckoutTrackerI> {
    /**
     * @param checkout_id as the checkout to which the required checkout object is linked
     */
    return this.httpClient.patch<HubCheckoutTrackerI>(this.apiUrl + "/next_status/" + checkout_id, {})
  }
}
