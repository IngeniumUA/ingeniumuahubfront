import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IItem} from "../../../shared/models/items/IItem";
import {apiEnviroment} from "../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private httpClient: HttpClient) { }

  public getItems(): Observable<IItem[]> {
    return this.httpClient.get<IItem[]>(apiEnviroment.apiUrl + "api/items/item/")
  };
  public getItem(itemId: string): Observable<IItem> {
    return this.httpClient.get<IItem>(apiEnviroment.apiUrl + "api/items/item/" + itemId);
  };
  public deleteItem(itemId: string): void {
    this.httpClient.delete(apiEnviroment.apiUrl + "api/items/item/" + itemId);
  };
  public createItem(itemData: IItem): void {
    this.httpClient.post(apiEnviroment.apiUrl + "api/items/item/", itemData);
  };
}
