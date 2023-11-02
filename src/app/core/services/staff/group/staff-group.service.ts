import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HubGroupI} from "../../../../shared/models/staff/HubGroup";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StaffGroupService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + "staff/group";

  public GetGroupsList(): Observable<HubGroupI[]> {
    return this.httpClient.get<HubGroupI[]>(this.apiUrl)
  }

  public AddUserToGroup(group_id: string, user_id: string): Observable<HubGroupI[]> {
    return this.httpClient.post<HubGroupI[]>(this.apiUrl + "/add/" + group_id.toString() + "/" + user_id,'')
  }

  public RemoveUserFromGroup(group_id: number, user_id: string): Observable<HubGroupI[]> {
    return this.httpClient.post<HubGroupI[]>(this.apiUrl + "/remove/" + group_id + "/" + user_id,'')
  }
}
