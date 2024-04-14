import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {HubCheckoutTrackerI} from "@ingenium/app/shared/models/tracker";


@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  constructor(private httpClient: HttpClient) {}

  apiUrl = apiEnviroment.apiUrl + 'user/tracker';

  public getTrackers(): Observable<HubCheckoutTrackerI[]> {
    /**
     * Fetches all current HubCheckoutTracker objects for the authenticated user
     * Hardcoded limit of 10 on backend
     */
    return this.httpClient.get<HubCheckoutTrackerI[]>(this.apiUrl)
  }
}
