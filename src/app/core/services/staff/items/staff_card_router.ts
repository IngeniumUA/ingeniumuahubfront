import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {apiEnviroment} from '../../../../../environments/environment';
import {StaffCardDetailI} from '../../../../shared/models/staff/staff_card_detail';

@Injectable({
  providedIn: 'root'
})
export class StaffCardService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'staff/card';

  public getCards(offset: number = 0, count: number = 50,
    user: string | null = null,
    card_type: string | null = null, card_nr: string | null,
    academic_year: string | null = null
  ): Observable<StaffCardDetailI[]> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (card_type !== null) {
      query_str += '&card_type=' + card_type.toString();
    }
    if (card_nr !== null) {
      query_str += '&card_nr=' + card_nr.toString();
    }
    if (academic_year !== null) {
      query_str += '&academic_year=' + academic_year.toString();
    }
    if (user !== null) {
      query_str += '&user=' + user.toString();
    }
    return this.httpClient.get<StaffCardDetailI[]>
    (this.apiUrl + query_str);
  }
  public getCardStats(offset: number = 0, count: number = 50,
    user: string | null = null,
    card_type: string | null = null, card_nr: string | null,
    academic_year: string | null = null
  ): Observable<any> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (card_type !== null) {
      query_str += '&card_type=' + card_type.toString();
    }
    if (card_nr !== null) {
      query_str += '&card_nr=' + card_nr.toString();
    }
    if (academic_year !== null) {
      query_str += '&academic_year=' + academic_year.toString();
    }
    if (user !== null) {
      query_str += '&user=' + user.toString();
    }
    return this.httpClient.get<any>
    (this.apiUrl + '/stats' + query_str);
  }



  public getCard(CardId: string): Observable<StaffCardDetailI> {
    return this.httpClient.get<StaffCardDetailI>(this.apiUrl + '/' + CardId);
  }
  public updateCard(CardId: string, Card_obj: StaffCardDetailI): Observable<StaffCardDetailI> {
    return this.httpClient.put<StaffCardDetailI>(this.apiUrl + '/' + CardId, Card_obj);
  }

  public UnlinkCard(card: StaffCardDetailI): Observable<StaffCardDetailI> {
    const edited_card: StaffCardDetailI = {
      id: card.id,
      academic_year: card.academic_year,
      user_id: null,
      user_email: null,
      card_type: card.card_type,
      card_nr: card.card_nr,
      linked_date: null,
      last_edited: card.last_edited,
      card_item: card.card_item
    };
    return this.updateCard(edited_card.id, edited_card);
  }
}
