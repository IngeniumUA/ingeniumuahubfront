import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {apiEnviroment} from '../../../../../environments/environment';
import {RecSysPreviewI} from '../../../../shared/models/items/recsys_interfaces';
import {PromoI} from '../../../../shared/models/items/promo';

@Injectable({
  providedIn: 'root'
})
export class PromoService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'item/promo';

  public getPromosList(limit: number, offset: number, type: string | null): Observable<RecSysPreviewI[]> {
    // Specifically fetches events for use as a preview
    // IE Homepage or events page
    let query_str = '?offset=' + offset.toString() + '&limit=' + limit.toString();
    if (type !== null) {
      query_str += '&type='+type;
    }
    return this.httpClient.get<RecSysPreviewI[]>(this.apiUrl + '/list' + query_str);
  }

  public getPromo(_type: string, item_id: string): Observable<PromoI> {
    return this.httpClient.get<PromoI>(this.apiUrl + '/' + item_id).pipe(shareReplay());
  }
}
