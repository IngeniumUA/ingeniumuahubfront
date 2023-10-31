import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {apiEnviroment} from "../../../../../environments/environment";
import {StaffCardDetailI} from "../../../../shared/models/staff/staff_card_detail";

@Injectable({
  providedIn: 'root'
})
export class StaffCardService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + "staff/card";

  public getCards(offset: number = 0, count: number = 50): Observable<StaffCardDetailI[]> {
    return this.httpClient.get<StaffCardDetailI[]>
    (this.apiUrl + "?offset=" + offset.toString() + "&limit=" + count.toString())
  };
  public getCard(CardId: string): Observable<StaffCardDetailI> {
    return this.httpClient.get<StaffCardDetailI>(this.apiUrl + "/" + CardId);
  };
  public updateCard(CardId: string, Card_obj: StaffCardDetailI): Observable<StaffCardDetailI> {
    return this.httpClient.put<StaffCardDetailI>(this.apiUrl + "/" + CardId, Card_obj);
  };

  public UnlinkCard(card: StaffCardDetailI): Observable<StaffCardDetailI> {
    const edited_card: StaffCardDetailI = {
      id: card.id,
      academic_year: card.academic_year,
      user_id: null,
      card_type: card.card_type,
      card_nr: card.card_nr,
      linked_date: null,
      last_edited: card.last_edited,
      card_item: card.card_item
    }
    return this.updateCard(edited_card.id, edited_card)
  }
}
