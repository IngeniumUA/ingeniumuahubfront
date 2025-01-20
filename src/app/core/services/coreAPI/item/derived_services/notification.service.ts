import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";
import {notification_token} from "@ingenium/app/app.component";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/notification/';

  public queryNotification(limit: number = 10, offset: number = 0): Observable<ItemWideLimitedI[]> {
    const param = {
      limit: limit,
      offset: offset
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<ItemWideLimitedI[]>(`${this.apiUrl}?${params.toString()}`).pipe(shareReplay())
  }

  public getNotification(item: string): Observable<ItemWideLimitedI> {
    return this.httpClient.get<ItemWideLimitedI>(`${this.apiUrl}${item}`).pipe(shareReplay())
  }

  sendNotification(item: string | number, title: string, body: string): Observable<void> {
    const payload = {
      title: title,
      body: body
    }
    return this.httpClient.post<void>(`${apiEnviroment.apiUrl}item/wide/notification/${item}/send_notification`, payload);
  }

  subscribe_to_topic(item: string | number): Observable<void> {
    const payload = {
      token: notification_token
    }
    return this.httpClient.post<void>(`${apiEnviroment.apiUrl}item/notification/subscribe/${item}`, payload);
  }

  unsubscribe_from_topic(item: string | number): Observable<void> {
    const payload = {
      token: notification_token
    }
    return this.httpClient.post<void>(`${apiEnviroment.apiUrl}item/notification/unsubscribe/${item}`, payload);
  }
}
