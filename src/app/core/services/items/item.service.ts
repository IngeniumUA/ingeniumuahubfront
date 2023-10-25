import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ItemI} from "../../../shared/models/items/ItemI";
import {apiEnviroment} from "../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private httpClient: HttpClient) { }

  public getItems(): Observable<ItemI[]> {
    return this.httpClient.get<ItemI[]>(apiEnviroment.apiUrl + "api/items/item/")
  };
  public getItem(itemId: string): Observable<ItemI> {
    return this.httpClient.get<ItemI>(apiEnviroment.apiUrl + "api/items/item/" + itemId);
  };
  public deleteItem(itemId: string): void {
    this.httpClient.delete(apiEnviroment.apiUrl + "api/items/item/" + itemId);
  };
  public createItem(itemData: ItemI): void {
    this.httpClient.post(apiEnviroment.apiUrl + "api/items/item/", itemData);
  };
}
