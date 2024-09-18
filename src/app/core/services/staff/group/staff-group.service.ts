import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {GroupI} from '../../../../shared/models/group/HubGroup';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffGroupService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'group/';

  public GetGroupsList(): Observable<GroupI[]> {
    return this.httpClient.get<GroupI[]>(this.apiUrl);
  }

  public AddUserToGroup(group_id: string, user_id: string): Observable<GroupI[]> {
    return this.httpClient.post<GroupI[]>(this.apiUrl + 'add/' + group_id.toString() + '/' + user_id,'');
  }

  public RemoveUserFromGroup(group_id: number, user_id: string): Observable<GroupI[]> {
    return this.httpClient.post<GroupI[]>(this.apiUrl + 'remove/' + group_id + '/' + user_id,'');
  }
}
