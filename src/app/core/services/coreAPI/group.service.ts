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

  public getGroup(groupId: number): Observable<GroupI> {
    return this.httpClient.get<GroupI>(`${this.apiUrl}/${groupId}`);
  }

  public getGroupMemberCount(groupId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl}/${groupId}/count`);
  }

  public GetGroupsList(user_uuid: string | null = null, academicYear: string | null = null): Observable<GroupI[]> {
    const param = {
      user_uuid: user_uuid,
      academic_year: academicYear
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<GroupI[]>(`${this.apiUrl}?${params.toString()}`);
  }

  public getGroupCount(user_uuid: string | null = null, academicYear: string | null = null): Observable<number> {
    const param = {
      user_uuid: user_uuid,
      academic_year: academicYear
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<number>(`${this.apiUrl}/count?${params.toString()}`);
  }

  public getGroupTable(limit: number, offset: number,
                       user_uuid: string | null = null, academicYear: string | null = null): Observable<[]> {
    const param = {
      limit: limit,
      offset: offset,
      user_uuid: user_uuid,
      academic_year: academicYear
    }
    const params = new URLSearchParams(removeNull(param));
    return this.httpClient.get<[]>(`${this.apiUrl}/table?${params.toString()}`);
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

  public putGroup(groupId: number, groupObj: GroupI): Observable<GroupI> {
    return this.httpClient.put<GroupI>(`${this.apiUrl}/${groupId}`, groupObj);
  }

  public patchGroup(groupId: number, groupObj: object): Observable<GroupI> {
    return this.httpClient.patch<GroupI>(`${this.apiUrl}/${groupId}`, groupObj);
  }

  public syncMembersWithKeycloak(groupId: number): Observable<boolean> {
    return this.httpClient.patch<boolean>(`${this.apiUrl}/sync_to_keycloak/${groupId}`, {});
  }
}
