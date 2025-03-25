import { Injectable } from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {ProductOutI} from '../../../shared/models/product/products';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  getProducts(item: string, access_key: string | null): Observable<ProductOutI[]> {
    const param = {
      access_key: access_key,
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<ProductOutI[]>(`${apiEnviroment.apiUrl}item/products/${item}?${params.toString()}`).pipe(shareReplay());
  }
}
