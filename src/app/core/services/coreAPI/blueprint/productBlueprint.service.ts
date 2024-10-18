import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '@ingenium/environments/environment';
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";
import {
  ProductBlueprintI,
  ProductBlueprintInI
} from "@ingenium/app/shared/models/product_blueprint/productBlueprintModels";


@Injectable({
  providedIn: 'root'
})
export class ProductBlueprintService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'blueprint';

  public queryProductTable(source_item_id: number | null = null,
                           origin_item_id: number | null = null,
                           transaction_status: PaymentStatusEnum | null = null): Observable<[]> {
    const param = {
      source_item_id: source_item_id,
      origin_item_id: origin_item_id,
      transaction_status: transaction_status
    }
    console.log(param)
    const params = new URLSearchParams(removeNull(param));
    console.log(params)
    return this.httpClient.get<[]>(`${this.apiUrl}/table?${params.toString()}`);
  }

  public queryProductBlueprints(offset: number = 0, count: number = 50,
                                source_item_id: number | null = null,
                                origin_item_id: number | null = null): Observable<ProductBlueprintI[]> {
    const param = {
      offset: offset,
      limit: count,
      source_item_id: source_item_id,
      origin_item_id: origin_item_id,
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<ProductBlueprintI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public getProductBlueprint(product_blueprint_id: number): Observable<ProductBlueprintI> {
    return this.httpClient.get<ProductBlueprintI>(`${this.apiUrl}/${String(product_blueprint_id)}`);
  }

  public postProductBlueprint(postObj: ProductBlueprintInI) {
    return this.httpClient.post<ProductBlueprintI>(`${this.apiUrl}`, postObj);
  }

  public putProductBlueprint(product_blueprint_id: number, putObj: ProductBlueprintI) {
    return this.httpClient.put<ProductBlueprintI>(`${this.apiUrl}/${String(product_blueprint_id)}`, putObj);
  }
}
