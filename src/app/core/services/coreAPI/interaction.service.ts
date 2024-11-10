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
                           user: string | null = null,
                           item: string | number | null = null
  ): Observable<InteractionI[]> {
    const param = {
      offset: offset,
      limit: count,
      interaction_identifier: interaction_id,
      user: user,
      item: item
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<InteractionI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public getInteractionCount(interaction_id: number | null = null,
                             user: string | null = null,
                             item: string | number | null = null
  ): Observable<number> {
    const param = {
      interaction_identifier: interaction_id,
      user: user,
      item: item
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`);
  }
}
