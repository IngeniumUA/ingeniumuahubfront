import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CardLimitedI} from '../../../shared/models/card';
import {Observable} from 'rxjs';
import {apiEnviroment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private httpClient: HttpClient) { }

  public post_card_uuid(card_uuid: string) {
    return this.httpClient.get<CardLimitedI>(apiEnviroment.apiUrl + 'item/card/assign_to_lid/' + card_uuid);
  }

  public link_card(card_uuid: string): Observable<CardLimitedI> {
    return this.httpClient.get<CardLimitedI>(apiEnviroment.apiUrl + 'item/card/link/' + card_uuid);
  }
}
