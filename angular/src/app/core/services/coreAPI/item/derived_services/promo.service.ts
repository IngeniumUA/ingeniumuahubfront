import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";


@Injectable({
  providedIn: 'root'
})
export class PromoService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/promo/';

  public getPromosList(limit: number, offset: number, promo_item_type?: number): Observable<RecSysPreviewI[]> {
    // Specifically fetches events for use as a preview
    // IE Homepage or events page
    let query_str = '?offset=' + offset.toString() + '&limit=' + limit.toString();
    if (typeof promo_item_type !== 'undefined') {
       query_str += '&promo_item_type='+ promo_item_type;
    }
    return this.httpClient.get<RecSysPreviewI[]>(this.apiUrl + 'list' + query_str);
  }

  public getPromos(): Observable<ItemWideLimitedI[]> {
    return this.httpClient.get<ItemWideLimitedI[]>(this.apiUrl);
  }

  public getPromo(_type: string, item_id: string): Observable<ItemWideLimitedI> {
    return this.httpClient.get<ItemWideLimitedI>(this.apiUrl + item_id).pipe(shareReplay());
  }
}
