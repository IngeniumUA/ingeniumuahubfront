import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {StaffProductBlueprintI} from '../../../shared/models/staff/staff_productblueprint';
import {GroupByModelI} from '../../../shared/models/stats/productStats';
import {IProductItem} from "@ingenium/app/shared/models/items/products/products";

@Injectable({
  providedIn: 'root'
})
export class StaffProductBlueprintService {
  apiUrl = apiEnviroment.apiUrl + 'blueprint';

  constructor(private httpClient: HttpClient) { }

  public getProductBlueprint(blueprint_id: string): Observable<StaffProductBlueprintI> {
    return this.httpClient.get<StaffProductBlueprintI>(`${this.apiUrl}/${blueprint_id}`);
  }

  public getProductBlueprints(offset: number = 0, count: number = 50,
    source_item_id: number | null = null,
    origin_item_id: number | null = null): Observable<StaffProductBlueprintI[]> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (source_item_id !== null) {
      query_str += '&source_item_id='+source_item_id;
    }
    if (origin_item_id !== null) {
      query_str += '&origin_item_id='+origin_item_id;
    }

    return this.httpClient.get<StaffProductBlueprintI[]>(
      this.apiUrl + query_str);
  }

  public post(product: any): Observable<StaffProductBlueprintI> {
    return this.httpClient.post<StaffProductBlueprintI>(this.apiUrl, product).pipe(shareReplay());
  }

  public putProductBlueprint(product_id: number, product_obj: StaffProductBlueprintI): Observable<StaffProductBlueprintI> {
    return this.httpClient.put<StaffProductBlueprintI>(`${this.apiUrl}/${product_id}`, product_obj);
  }

  public getProductBlueprintStats(offset: number = 0, count: number = 50,
    source_item_id: number | null = null,
    origin_item_id: number | null = null): Observable<GroupByModelI> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (source_item_id !== null) {
      query_str += '&source_item_id='+source_item_id;
    }
    if (origin_item_id !== null) {
      query_str += '&origin_item_id='+origin_item_id;
    }

    return this.httpClient.get<GroupByModelI>(`${this.apiUrl}/group_by${query_str}`);
  }

  public getProducts(offset: number = 0, count: number = 50,
  source_item_id: number | null = null,
  origin_item_id: number | null = null): Observable<IProductItem[]> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (source_item_id !== null) {
      query_str += '&source_item_id='+source_item_id;
    }
    if (origin_item_id !== null) {
      query_str += '&origin_item_id='+origin_item_id;
    }

    return this.httpClient.get<IProductItem[]>(`${this.apiUrl}/products${query_str}`);
  }
}
