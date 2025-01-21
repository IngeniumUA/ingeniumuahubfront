import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {removeNull} from "@ingenium/app/core/services/serviceUtils";
import {InteractionI} from "@ingenium/app/shared/models/interaction/hubInteractionI";

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'interaction';

  public queryInteractions(offset: number = 0, count: number = 50,
                           interaction_id: number | null = null,
                           interaction_identifier: number | string | null = null,
                           user: string | null = null,
                           item: string | number | null = null,
                           item_name_contains: string | null,  // TODO - Hardcode should become general
                           user_email_contains: string | null,  // Here as well
  ): Observable<InteractionI[]> {
    const param = {
      offset: offset,
      limit: count,
      interaction_id: interaction_id,
      interaction_identifier: interaction_identifier,
      user: user,
      item: item,
      item_name_contains: item_name_contains,
      user_email_contains: user_email_contains
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<InteractionI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public getInteractionCount(interaction_id: number | null = null,
                             interaction_identifier: number | string | null = null,
                             user: string | null = null,
                             item: string | number | null = null,
                             item_name_contains: string | null,  // TODO - Hardcode should become general
                             user_email_contains: string | null,  // Here as well
  ): Observable<number> {
    const param = {
      interaction_id: interaction_id,
      interaction_identifier: interaction_identifier,
      user: user,
      item: item,
      item_name_contains: item_name_contains,
      user_email_contains: user_email_contains
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`);
  }
}
