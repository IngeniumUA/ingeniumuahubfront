import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {EventItemDetailI} from '../../../../shared/models/items/events';
import {apiEnviroment} from '../../../../../environments/environment';
import {RecSysPreviewI} from '../../../../shared/models/items/recsys_interfaces';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/event';

  public getEventsList(): Observable<RecSysPreviewI[]> {
    // Specifically fetches events for use as a preview
    // IE Homepage or events page
    return this.httpClient.get<RecSysPreviewI[]>(this.apiUrl + '/list');
  }

  public getEvents(): Observable<EventItemDetailI[]> {
    // TODO Move in own staff event service
    return this.httpClient.get<EventItemDetailI[]>(apiEnviroment.apiUrl + 'staff/event');
  }

  public getEvent(eventId: string): Observable<EventItemDetailI> {
    // return of(TESTevent)
    return this.httpClient.get<EventItemDetailI>(this.apiUrl + '/' + eventId).pipe(shareReplay());
  }
}
