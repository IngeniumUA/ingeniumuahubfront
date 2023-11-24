import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {StaffProductBlueprintI} from "../../../shared/models/staff/staff_productblueprint";

@Injectable({
  providedIn: 'root'
})
export class StaffProductBlueprintService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + "staff/blueprint";

  public getProductBlueprint(offset: number = 0, count: number = 50,
                             source_item_id: string | null = null,
                             origin_item_id: string | null = null): Observable<StaffProductBlueprintI[]> {
    let query_str = "?offset=" + offset.toString() + "&limit=" + count.toString()
    if (source_item_id !== null) {
      query_str += "&source_item_id="+source_item_id;
    }
    if (origin_item_id !== null) {
      query_str += "&origin_item_id="+origin_item_id;
    }

    return this.httpClient.get<StaffProductBlueprintI[]>(
      this.apiUrl + query_str)
  };

  public post(product: any): Observable<StaffProductBlueprintI> {
    return this.httpClient.post<StaffProductBlueprintI>(this.apiUrl, product)
  }

}
