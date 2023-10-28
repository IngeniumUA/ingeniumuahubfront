import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {apiEnviroment} from "../../../../../enviroments";
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
}
