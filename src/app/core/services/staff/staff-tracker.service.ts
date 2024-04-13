import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '../../../../environments/environment';
import {HubCheckoutTrackerI} from "@ingenium/app/shared/models/tracker";


@Injectable({
  providedIn: 'root'
})
export class StaffTrackerService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'staff/tracker';

  public getTrackers(offset: number = 0, count: number = 50,
                     item: string | null = null,
                     tracker_status: string | number | null = null): Observable<HubCheckoutTrackerI> {
    /**
     * Fetches HubCheckoutTracker objects
     * @param item can both be item_name and item_uuid
     * @param tracker_status as either integer or correct string
     */
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (item !== null) {
      query_str += '&item='+item;
    }
    if (tracker_status !== null) {
      query_str += '&tracker_status='+String(item);
    }

    return this.httpClient.get<HubCheckoutTrackerI>(this.apiUrl + query_str)
  }

  public nextStatus(checkout_id: string): Observable<HubCheckoutTrackerI> {
    /**
     * @param checkout_id as the checkout to which the required checkout object is linked
     */
    return this.httpClient.patch<HubCheckoutTrackerI>(this.apiUrl + "/next_status/" + checkout_id, {})
  }
}
