import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StaffItemCreateI, StaffItemDetailI} from '../../../../shared/models/staff/staff_item_details';
import {apiEnviroment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffItemService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'staff/item';

  public getItems(limit: number = 50, offset: number = 0,
    item_type: string | null = null): Observable<StaffItemDetailI[]> {
    let queryParams = '?limit=' + limit.toString() + '&offset=' + offset.toString();

    if (item_type !== null) {
      queryParams += '&type=' + item_type;
    }

    return this.httpClient.get<StaffItemDetailI[]>(this.apiUrl + queryParams);
  }
  public getItem(itemId: string): Observable<StaffItemDetailI> {
    return this.httpClient.get<StaffItemDetailI>(this.apiUrl + '/' + itemId);
  }
  public createItem(item_obj: StaffItemCreateI): Observable<StaffItemDetailI> {
    return this.httpClient.post<StaffItemDetailI>(this.apiUrl, item_obj);
  }
  public putItem(itemId: string, item_obj: StaffItemDetailI): Observable<StaffItemDetailI> {
    return this.httpClient.put<StaffItemDetailI>(this.apiUrl + '/' + itemId, item_obj);
  }

  public patchItem(itemId: string, object: any): Observable<StaffItemDetailI> {
    return this.httpClient.patch<StaffItemDetailI>(this.apiUrl + '/' + itemId, object);
  }
}
