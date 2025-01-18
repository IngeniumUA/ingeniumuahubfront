import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  apiUrl = apiEnviroment.apiUrl + 'item/shop/';

  constructor(private httpClient: HttpClient) { }

  public getShopItems(): Observable<HttpState<RecSysPreviewI[]>> {
    return ItemService.makeRequestWithHttpState(this.httpClient, this.apiUrl + 'list');
  }

  public getShop(shopId: string, access_key: string | null): Observable<HttpState<ItemWideLimitedI>> {
    const param = {
      access_key: access_key,
    }
    const params = new URLSearchParams(removeNull(param));
    return ItemService.makeRequestWithHttpState<ItemWideLimitedI>(this.httpClient, `${this.apiUrl}${shopId}?${params.toString()}`).pipe(shareReplay());
  }
}
