import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of, shareReplay} from "rxjs";
import {EventItemDetailI} from "../../../../shared/models/items/events";
import {ItemI} from "../../../../shared/models/items/ItemI";
import {apiEnviroment} from "../../../../../environments/environment";
import {RecSysPreviewI} from "../../../../shared/models/items/recsys_interfaces";
import {PromoI} from "../../../../shared/models/items/promo";

@Injectable({
    providedIn: 'root'
})
export class PromoService {

    constructor(private httpClient: HttpClient) { }

    apiUrl = apiEnviroment.apiUrl + "item/promo";

    public getPromosList(type: string): Observable<RecSysPreviewI[]> {
        // Specifically fetches events for use as a preview
        // IE Homepage or events page
        return this.httpClient.get<RecSysPreviewI[]>(this.apiUrl + "/list")
    }

    public getPromo(type: string, item_id: string): Observable<PromoI> {
        // return of(TESTevent)
        return this.httpClient.get<PromoI>(this.apiUrl + "/" + item_id).pipe(shareReplay())
    }
}
