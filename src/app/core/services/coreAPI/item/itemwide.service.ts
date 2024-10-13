import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {ItemWideI, ItemWideInI} from "@ingenium/app/shared/models/item/itemwideI";

@Injectable({
  providedIn: 'root'
})
export class ItemWideService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/wide';

  public getItems(limit: number = 50, offset: number = 0, item_type: string | null = null): Observable<ItemWideI[]> {
    let queryParams = '?limit=' + limit.toString() + '&offset=' + offset.toString();

    if (item_type !== null) {
      queryParams += '&type=' + item_type;
    }
    return this.httpClient.get<ItemWideI[]>(this.apiUrl + queryParams);
  }
  public getItem(itemId: string | number): Observable<ItemWideI> {
    return this.httpClient.get<ItemWideI>(`${this.apiUrl}/${itemId}`);
  }
  public deleteItem(itemId: number): void {
    this.httpClient.delete(`${this.apiUrl}/${itemId}`);
  }
  public createItem(itemData: ItemWideInI): Observable<ItemWideI> {
    return this.httpClient.post<ItemWideI>(this.apiUrl, itemData);
  }

  public putItem(itemId: number, itemData: ItemWideI): Observable<ItemWideI> {
    return this.httpClient.put<ItemWideI>(`${this.apiUrl}/${itemId}`, itemData);
  }
}
