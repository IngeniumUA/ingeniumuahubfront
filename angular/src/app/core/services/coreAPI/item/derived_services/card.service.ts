import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {Observable} from "rxjs";
import {CardItemWideI} from "@ingenium/app/shared/models/item/cardI";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'item/wide/card';

  public queryCards(offset: number = 0, count: number = 50,
                    user: string | null = null, cardType: number | null = null, cardName: string | null = null
  ): Observable<CardItemWideI[]> {
    const param = {
      offset: offset,
      limit: count,
      user: user,
      member_type: cardType,
      item: cardName
    }

    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<CardItemWideI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public unlinkCard(card_id: number): Observable<CardItemWideI> {
    const patchModel = {
      derived_type: {
        derived_type_enum: 'carditem',
        user: null
      }
    }
    return this.httpClient.patch<CardItemWideI>(`${this.apiUrl}/${card_id}`, patchModel);
  }

  public getCard(item_id: number): Observable<CardItemWideI> {
    return this.httpClient.get<CardItemWideI>(`${this.apiUrl}/${item_id}`);
  }

  public putCard(item_id: number, putModel: CardItemWideI): Observable<CardItemWideI> {
    return this.httpClient.put<CardItemWideI>(`${this.apiUrl}/${item_id}`, putModel);
  }
}
