import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {FlagI, FlagInI, FlagPatchI} from "@ingenium/app/shared/models/flag/flagModels";

@Injectable({
  providedIn: 'root'
})
export class FlagService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'flag';

  public queryFlags(): Observable<FlagI[]> {
    return this.httpClient.get<FlagI[]>(`${this.apiUrl}`);
  }

  public postFlag(flagObj: FlagInI): Observable<FlagI> {
    return this.httpClient.post<FlagI>(`${this.apiUrl}`, flagObj);
  }

  public patchFlag(flagObj: FlagPatchI): Observable<FlagI> {
    return this.httpClient.patch<FlagI>(`${this.apiUrl}`, flagObj);
  }
}
