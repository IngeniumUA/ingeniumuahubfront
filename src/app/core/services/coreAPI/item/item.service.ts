import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {ItemI, ItemInI} from "@ingenium/app/shared/models/item/itemI";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/';

  public getItems(): Observable<ItemI[]> {
    return this.httpClient.get<ItemI[]>(this.apiUrl);
  }
  public getItem(itemId: string): Observable<ItemI> {
    return this.httpClient.get<ItemI>(this.apiUrl + itemId);
  }
  public deleteItem(itemId: string): void {
    this.httpClient.delete(this.apiUrl + itemId);
  }
  public createItem(itemData: ItemInI): void {
    this.httpClient.post(this.apiUrl, itemData);
  }
}
