import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Item} from "../../../shared/models/items/item";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  url: string = "http://127.0.0.1:8000/api/items/item/";
  // url: string = "https://ingeniumuahub.ew.r.appspot.com/";
  constructor(private httpClient: HttpClient) { }

  public getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(this.url)
  };
  public getItem(itemId: string): Observable<Item> {
    return this.httpClient.get<Item>(this.url + itemId);
  };
  public deleteItem(itemId: string): void {
    this.httpClient.delete(this.url + itemId);
  };
  public createItem(itemData: Item): void {
    this.httpClient.post(this.url, itemData);
  };
}
