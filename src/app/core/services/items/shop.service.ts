import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, shareReplay} from "rxjs";
import {RecSysPreviewI} from "../../../shared/models/items/recsys_interfaces";
import {apiEnviroment} from "../../../../enviroments";
import {EventItemDetailI} from "../../../shared/models/items/events";
import {ShopItemDetailI} from "../../../shared/models/items/shopitem";

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private httpClient: HttpClient) { }

  public getShopitemsList(): Observable<RecSysPreviewI[]> {
    return this.httpClient.get<RecSysPreviewI[]>(apiEnviroment.apiEnv + "item/shop/list")
  }

  public getShopItem(itemId: string): Observable<ShopItemDetailI> {
    return this.httpClient.get<ShopItemDetailI>(apiEnviroment.apiEnv + "item/shop/" + itemId).pipe(shareReplay())
  }
}
