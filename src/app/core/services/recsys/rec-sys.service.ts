import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../environments/environment";
import {RecSysPreviewI} from "../../../shared/models/items/recsys_interfaces";

@Injectable({
  providedIn: 'root'
})
export class RecSysService {

  constructor(private httpClient: HttpClient) { }

  public getHomepageSlide(count: number): Observable<RecSysPreviewI[]> {
    return this.httpClient.get<RecSysPreviewI[]>(apiEnviroment.apiUrl + "rec/homepage?count=" + count.toString())
  }
}
