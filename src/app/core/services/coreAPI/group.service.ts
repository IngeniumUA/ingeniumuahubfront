import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {GroupI, GroupInI} from '../../../shared/models/group/hubGroupI';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'group';

  public GetGroupsList(user_uuid: string | null = null, academicYear: string | null = null): Observable<GroupI[]> {
    const param = {
      user_uuid: user_uuid,
      academic_year: academicYear
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<GroupI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public AddUserToGroup(group_id: string, user_id: string): Observable<GroupI[]> {
    return this.httpClient.post<GroupI[]>(`${this.apiUrl}/add/${group_id}/${user_id}`, '');
  }

  public RemoveUserFromGroup(group_id: number, user_id: string): Observable<GroupI[]> {
    return this.httpClient.post<GroupI[]>(`${this.apiUrl}/remove/${group_id}/${user_id}`,'');
  }

  public postGroup(groupObj: GroupInI): Observable<GroupI> {
    return this.httpClient.post<GroupI>(`${this.apiUrl}`, groupObj);
  }
}
