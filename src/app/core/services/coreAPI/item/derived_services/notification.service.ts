import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/notification/';

  public queryPromo(limit: number = 10, offset: number = 0): Observable<ItemWideLimitedI[]> {
    const param = {
      limit: limit,
      offset: offset
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<ItemWideLimitedI[]>(`${this.apiUrl}?${params.toString()}`).pipe(shareReplay())
  }

  public getPromo(item: string): Observable<ItemWideLimitedI> {
    return this.httpClient.get<ItemWideLimitedI>(`${this.apiUrl}${item}`).pipe(shareReplay())
  }

  sendNotification(notification_item_topic: string,
                           title: string,
                           body: string) {
    const payload = {
      title: title,
      body: body
    }
    this.httpClient.post(`${apiEnviroment.apiUrl}item/wide/notification/${notification_item_topic}/send_notification`, payload);
  }
}
