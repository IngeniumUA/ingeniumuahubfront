import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'partner';

  getCurrentPartnerLogos(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/logo`);
  }

  getPartnerLogos(year: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/logo/${year}`);
  }
}
