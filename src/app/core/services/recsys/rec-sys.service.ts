import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class RecSysService {

  constructor(private httpClient: HttpClient) { }


  public getEventPreview(): Observable<any> {
    return this.httpClient.get( apiEnviroment.apiUrl + "api/items/recsys/itempreview");
  }
}
