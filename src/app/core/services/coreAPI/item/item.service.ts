import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of, startWith} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {ItemI, ItemInI} from "@ingenium/app/shared/models/item/itemI";
import {RecSysPreviewI} from "@ingenium/app/shared/models/items/recsys_interfaces";
import {map} from "rxjs/operators";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {captureException} from "@sentry/angular";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item';

  public getItems(): Observable<ItemI[]> {
    return this.httpClient.get<ItemI[]>(this.apiUrl);
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

  public static makeRecSysRequestWithHttpState(httpClient: HttpClient, path: string): Observable<HttpState<RecSysPreviewI[]>>  {
    return httpClient.get<RecSysPreviewI[]>(path)
      .pipe(
        map((events: RecSysPreviewI[]): HttpState<RecSysPreviewI[]> => {
          return {
            data: events,
            error: null,
            loading: false,
          }
        }),
        catchError((error): Observable<HttpState<RecSysPreviewI[]>> => {
          captureException(error);
          return of({
            data: [],
            error: error,
            loading: false,
          })
        }),
        startWith<HttpState<RecSysPreviewI[]>>({
          data: [],
          error: null,
          loading: true,
        })
      );
  }
}
