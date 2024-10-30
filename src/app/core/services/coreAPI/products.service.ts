import { Injectable } from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {ProductOutI} from '../../../shared/models/product/products';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  getProducts(itemID: string): Observable<ProductOutI[]> {
    return this.httpClient.get<ProductOutI[]>(apiEnviroment.apiUrl + 'item/products/' + itemID).pipe(shareReplay());
  }
}
