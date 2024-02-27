import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {StaffProductBlueprintI} from "../../../shared/models/staff/staff_productblueprint";
import {ProductStatsI} from "../../../shared/models/stats/productStats";
import {IProductItem} from "../../../shared/models/items/products/products";

@Injectable({
  providedIn: 'root'
})
export class StaffProductService {
  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + "staff/product";

  public getProducts(offset: number = 0, count: number = 50,
                     source_item_id: string | null = null,
                     blueprint_id: string | null = null): Observable<IProductItem[]> {
      let query_str = "?offset=" + offset.toString() + "&limit=" + count.toString()
      if (source_item_id !== null) {
          query_str += "&source_item_id="+source_item_id;
      }
      if (blueprint_id !== null) {
          query_str += "&blueprint_id="+blueprint_id;
      }
    return this.httpClient.get<IProductItem[]>(this.apiUrl + query_str)
  }

}
