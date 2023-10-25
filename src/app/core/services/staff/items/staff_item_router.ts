import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StaffItemDetailI} from "../../../../shared/models/staff/staff_item_details";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class StaffItemService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + "staff/item";

  public getItems(): Observable<StaffItemDetailI[]> {
    return this.httpClient.get<StaffItemDetailI[]>(this.apiUrl)
  };
  public getItem(itemId: string): Observable<StaffItemDetailI> {
    return this.httpClient.get<StaffItemDetailI>(this.apiUrl + "/" + itemId);
  };
  public createItem(item_obj: StaffItemDetailI): Observable<StaffItemDetailI> {
    return this.httpClient.post<StaffItemDetailI>(this.apiUrl, item_obj)
  }
  public updateItem(itemId: string, item_obj: StaffItemDetailI): Observable<StaffItemDetailI> {
    return this.httpClient.put<StaffItemDetailI>(this.apiUrl + "/" + itemId, item_obj);
  };
}
