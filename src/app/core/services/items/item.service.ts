import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Item} from "../../../shared/models/items/item";
import {apiEnviroment} from "../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private httpClient: HttpClient) { }

  public getItems(): Observable<Item[]> {
    return this.httpClient.get<Item[]>(apiEnviroment.apiUrl + "api/items/item/")
  };
  public getItem(itemId: string): Observable<Item> {
    return this.httpClient.get<Item>(apiEnviroment.apiUrl + "api/items/item/" + itemId);
  };
  public deleteItem(itemId: string): void {
    this.httpClient.delete(apiEnviroment.apiUrl + "api/items/item/" + itemId);
  };
  public createItem(itemData: Item): void {
    this.httpClient.post(apiEnviroment.apiUrl + "api/items/item/", itemData);
  };
}
