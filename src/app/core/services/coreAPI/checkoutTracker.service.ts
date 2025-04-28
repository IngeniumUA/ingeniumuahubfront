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

  public printTracker(checkout_tracker_id: number) {
    return this.httpClient.post<boolean>(`${this.apiUrl}/print/${checkout_tracker_id}`, {})
  }

  public getTrackerCount(item: string | number | null = null,
                         tracker_status: string | number | null = null,
                         checkout_tracker_id: number | null = null,
                         disabled: boolean | null = false): Observable<number> {
    /**
     * Fetches HubCheckoutTracker objects
     * @param item can both be item_name and item_id
     * @param tracker_status as either integer or correct string
     * @param checkout_tracker_id unique ID of checkout tracker object (mostly for debugging)
     * @param disabled if tracker has been 'completed' (so, is disabled)
     */
    const param = {
      item: item,
      checkout_tracker_id: checkout_tracker_id,
      checkout_tracker_status: tracker_status,
      disabled: disabled === null ? "None" : disabled,  // Translate to "None" for parsing
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`)
  }

  public getTrackers(offset: number = 0, count: number = 50,
                     item: string | number | null = null,
                     tracker_status: string | number | null = null,
                     checkout_tracker_id: number | null = null,
                     disabled: boolean | null = false): Observable<HubCheckoutTrackerI[]> {
    /**
     * Fetches HubCheckoutTracker objects
     * @param item can both be item_name and item_uuid
     * @param tracker_status as either integer or correct string
     * @param checkout_tracker_id unique ID of checkout tracker object (mostly for debugging)
     * @param disabled if tracker has been 'completed' (so, is disabled)
     */
    const param = {
      offset: offset,
      limit: count,
      item: item,
      checkout_tracker_id: checkout_tracker_id,
      checkout_tracker_status: tracker_status,
      disabled: disabled === null ? "None" : disabled,  // Translate to "None" for parsing
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
