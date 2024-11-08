import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  apiUrl = apiEnviroment.apiUrl + 'item/shop/';

  constructor(private httpClient: HttpClient) { }

  public getShopItems(): Observable<HttpState<RecSysPreviewI[]>> {
    return ItemService.makeRecSysRequestWithHttpState(this.httpClient, this.apiUrl + 'list');
  }

  public getShop(shopId: string): Observable<ItemWideLimitedI> {
    return this.httpClient.get<ItemWideLimitedI>(this.apiUrl + shopId).pipe(shareReplay());
  }
}
