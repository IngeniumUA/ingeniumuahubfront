import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiEnviroment} from '../../../../environments/environment';
import {StaffUserDetailI} from '../../../shared/models/staff/staff_user_detail';

@Injectable({
  providedIn: 'root'
})
export class StaffUserService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + 'staff/user';

  public getUsers(offset: number = 0, count: number = 50,
    user: string | null = null,
    user_email: string | null = null,
    user_ismemberof_group: number[] = []
  ): Observable<StaffUserDetailI[]> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (user !== null) {
      query_str += '&user=' + user.toString();
    }
    if (user_email !== null) {
      query_str += '&user_email=' + user_email.toString();
    }
    user_ismemberof_group.forEach((group) => {
      query_str += '&ismemberof_group=' + group.toString();
    });
    return this.httpClient.get<StaffUserDetailI[]>(
      this.apiUrl + query_str);
  }

  public getUserStats(offset: number = 0, count: number = 50,
    user: string | null = null,
    user_email: string | null = null,
    user_ismemberof_group: number[] = []
  ): Observable<number> {
    let query_str = '?offset=' + offset.toString() + '&limit=' + count.toString();
    if (user !== null) {
      query_str += '&user=' + user.toString();
    }
    if (user_email !== null) {
      query_str += '&user_email=' + user_email.toString();
    }
    user_ismemberof_group.forEach((group) => {
      query_str += '&ismemberof_group=' + group.toString();
    });
    return this.httpClient.get<number>(
      this.apiUrl + '/stats' + query_str);
  }

  public getUsersExport(fields: string[],
    user: string | null = null,
    user_email: string | null = null,
    user_ismemberof_group: number[] = []):
      Observable<any>{
    let query_str = '?';

    // Fields parsing
    // Starts from second item
    if (fields.length == 0) {
      query_str +='fields=email';
    } else {
      query_str += 'fields=' + fields[0];
    }
    fields.slice(1).forEach((field: string) => {
      query_str += '&fields=' + field;
    });

    if (user !== null) {
      query_str += '&user=' + user.toString();
    }
    if (user_email !== null) {
      query_str += '&user_email=' + user_email.toString();
    }
    user_ismemberof_group.forEach((group) => {
      query_str += '&ismemberof_group=' + group.toString();
    });

    const httpOptions: Object = {
      responseType: ('blob' as 'application/vnd.ms-excel')
    };

    return this.httpClient.get<Blob>(this.apiUrl + '/export' + query_str, httpOptions);
  }

  public getUser(userId: string): Observable<StaffUserDetailI> {
    return this.httpClient.get<StaffUserDetailI>(this.apiUrl + '/' + userId);
  }
  public createUser(user_obj: StaffUserDetailI): Observable<StaffUserDetailI> {
    return this.httpClient.post<StaffUserDetailI>(this.apiUrl, user_obj);
  }
  public updateUser(userId: string, user_obj: StaffUserDetailI): Observable<StaffUserDetailI> {
    return this.httpClient.put<StaffUserDetailI>(this.apiUrl + '/' + userId, user_obj);
  }
}
