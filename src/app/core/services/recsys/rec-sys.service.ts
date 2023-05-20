import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecSysService {

  constructor(private httpClient: HttpClient) { }


  public getEventPreview(): Observable<any> {
    return this.httpClient.get("https://ingeniumuahub.ew.r.appspot.com/api/items/recsys/itempreview");
  }
}
