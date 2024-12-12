import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/event/';

  public getEventsList(): Observable<HttpState<RecSysPreviewI[]>> {
    return ItemService.makeRequestWithHttpState<RecSysPreviewI[]>(this.httpClient, this.apiUrl + 'list');
  }

  public getEvents(): Observable<ItemWideLimitedI[]> {
    return this.httpClient.get<ItemWideLimitedI[]>(this.apiUrl);
  }

  public getEvent(eventId: string): Observable<HttpState<ItemWideLimitedI>> {
    return ItemService.makeRequestWithHttpState<ItemWideLimitedI>(this.httpClient, this.apiUrl + eventId).pipe(shareReplay());
  }
}
