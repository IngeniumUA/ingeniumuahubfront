import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../enviroments";

export interface AssignLidPayload {
  email: string
  card_type: string | null // 'null', 'lid', 'steunend'
  card_nr: string | null
}

@Injectable({
  providedIn: 'root'
})
export class StaffFunctionsService {

  constructor(private httpClient: HttpClient) { }

  public register_new_account(email: string, lid_type: string, lidkaart_nr: string | null): Observable<AssignLidPayload> {
    return this.httpClient.post<AssignLidPayload>(apiEnviroment.apiEnv['apiUrl'] + "staff/functions/assign_lid_to_account",
      { email: email, card_type: lid_type, card_nr: lidkaart_nr } )
  }

  public undo_register_new_account(succes_response: AssignLidPayload) {

  }
}
