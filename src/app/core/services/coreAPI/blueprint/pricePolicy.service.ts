import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {PricePolicyI, PricePolicyInI} from "@ingenium/app/shared/models/price_policy";

@Injectable({
  providedIn: 'root'
})
export class PricePolicyService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'blueprint/price_policy/';

  public getPricePolicies(blueprint_id: number | null = null): Observable<PricePolicyI[]> {
    const queryStr = blueprint_id === null ? "" : `?blueprint_id=${blueprint_id}`

    return this.httpClient.get<PricePolicyI[]>(`${this.apiUrl}${queryStr}`);
  }
  public putPricePolicy(price_policy: PricePolicyI): Observable<PricePolicyI> {
    return this.httpClient.put<PricePolicyI>(`${this.apiUrl}${price_policy.id}`, price_policy);
  }
  public deletePricePolicy(pricePolicyId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}${pricePolicyId}`);
  }
  public createPricePolicy(pricePolicyIn: PricePolicyInI): Observable<PricePolicyI> {
    return this.httpClient.post<PricePolicyI>(this.apiUrl, pricePolicyIn);
  }
}
