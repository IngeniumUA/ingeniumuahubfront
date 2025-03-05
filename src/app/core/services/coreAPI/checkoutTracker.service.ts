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

  public getTrackerCount(item: string | number | null = null,
                         tracker_status: string | number | null = null,
                         checkout_tracker_id: number | null = null): Observable<number> {
    /**
     * Fetches HubCheckoutTracker objects
     * @param item can both be item_name and item_id
     * @param tracker_status as either integer or correct string
     * @param checkout_tracker_id unique ID of checkout tracker object (mostly for debugging)
     */
    const param = {
      item: item,
      checkout_tracker_id: checkout_tracker_id,
      tracker_status: tracker_status,
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`)
  }

  public getTrackers(offset: number = 0, count: number = 50,
                     item: string | number | null = null,
                     tracker_status: string | number | null = null,
                     checkout_tracker_id: number | null = null): Observable<HubCheckoutTrackerI[]> {
    /**
     * Fetches HubCheckoutTracker objects
     * @param item can both be item_name and item_uuid
     * @param tracker_status as either integer or correct string
     * @param checkout_tracker_id unique ID of checkout tracker object (mostly for debugging)
     */
    const param = {
      offset: offset,
      limit: count,
      item: item,
      checkout_tracker_id: checkout_tracker_id,
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
