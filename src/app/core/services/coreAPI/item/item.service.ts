import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of, startWith} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {ItemI, ItemInI, ItemTypeEnum} from "@ingenium/app/shared/models/item/itemI";
import {map} from "rxjs/operators";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {captureException} from "@sentry/angular";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item';

  public queryItems(offset: number = 0, count: number = 50, itemType: ItemTypeEnum[] | []): Observable<ItemI[]> {
    const param = {
      offset: offset,
      limit: count
    }
    const params = new URLSearchParams(removeNull(param));
    for (const item_type of itemType) {
      params.append("item_type", ItemTypeEnum[item_type])
    }
    return this.httpClient.get<ItemI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public countItems(itemType: ItemTypeEnum[] | []): Observable<number> {
    const param = {

    }
    const params = new URLSearchParams(removeNull(param));
    for (const item_type of itemType) {
      params.append("item_type", ItemTypeEnum[item_type])
    }
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`);
  }

  public getItem(itemId: string): Observable<ItemI> {
    return this.httpClient.get<ItemI>(this.apiUrl + "/" + itemId);
  }
  public deleteItem(itemId: string): void {
    this.httpClient.delete(this.apiUrl + "/" + itemId);
  }
  public createItem(itemData: ItemInI): void {
    this.httpClient.post(this.apiUrl, itemData);
  }

  // TODO: Move this to somewhere else as it is a generic function
  public static makeRequestWithHttpState<T>(httpClient: HttpClient, path: string): Observable<HttpState<T>>  {
    return httpClient.get<T>(path)
      .pipe(
        map((data: T): HttpState<T> => {
          return {
            data,
            error: null,
            loading: false,
          }
        }),
        catchError((error): Observable<HttpState<T>> => {
          captureException(error);
          return of({
            data: null,
            error,
            loading: false,
          })
        }),
        startWith<HttpState<T>>({
          data: null,
          error: null,
          loading: true,
        })
      );
  }
}
