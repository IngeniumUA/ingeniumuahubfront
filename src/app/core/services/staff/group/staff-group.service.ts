import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HubGroupI} from "../../../../shared/models/staff/HubGroup";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class StaffGroupService {

  constructor(private httpClient: HttpClient) {
  }

  public GetGroupsList(): Observable<HubGroupI[]> {
    return this.httpClient.get<HubGroupI[]>(apiEnviroment.apiEnv['apiUrl'] + "staff/group")
  }
}
