import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class MediabucketFileService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'file';

  public listFileNames(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/media/list`);
  }

  public getWalletLinks(transaction_uuid: string,
                        banner_link: string,
                        event_name: string,
                        end_date: string,
                        start_date: string,
                        nummer: number,
                        locatie_naam: string,
                        platform: string): Observable<string>{
    const param = {
      transaction_uuid: transaction_uuid,
      banner_link: banner_link,
      event_name: event_name,
      end_date: end_date,
      start_date: start_date,
      nummer: nummer,
      locatie_naam: locatie_naam
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<string>(`${this.apiUrl}/wallet/${platform}?${params.toString()}`);
  }

}
