import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";


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

  sendNotification(item: string | number, title: string, body: string, data: object | null): Observable<void> {
    const payload = {
      title: title,
      body: body,
      data: data
    }
    return this.httpClient.post<void>(`${apiEnviroment.apiUrl}item/wide/notification/${item}/send_notification`, payload);
  }

  sendNotificationUser(email: string, title: string, body: string, data: object | null): Observable<void> {
    const payload = {
      title: title,
      body: body,
      data: data
    }
    return this.httpClient.post<void>(`${apiEnviroment.apiUrl}item/wide/notification/user/${email}/send_notification`, payload);
  }
}
