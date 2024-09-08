import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RecSysPreviewI} from '../../../../../shared/models/items/recsys_interfaces';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";


@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/shop/';

  public getShopsList(): Observable<RecSysPreviewI[]> {
    // Specifically fetches shops for use as a preview
    // IE Homepage or shops page
    return this.httpClient.get<RecSysPreviewI[]>(this.apiUrl + 'list');
  }

  public getShops(): Observable<ItemWideLimitedI[]> {
    return this.httpClient.get<ItemWideLimitedI[]>(this.apiUrl);
  }

  public getShop(shopId: string): Observable<ItemWideLimitedI> {
    return this.httpClient.get<ItemWideLimitedI>(this.apiUrl + shopId).pipe(shareReplay());
  }
}
