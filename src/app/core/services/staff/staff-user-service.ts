import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiEnviroment} from "../../../../enviroments";
import {StaffUserDetailI} from "../../../shared/models/staff/staff_user_detail";

@Injectable({
  providedIn: 'root'
})
export class StaffUserService {
  constructor(private httpClient: HttpClient) { }

  apiUrl = apiEnviroment.apiUrl + "staff/user";

  public getUsers(): Observable<StaffUserDetailI[]> {
    return this.httpClient.get<StaffUserDetailI[]>(this.apiUrl)
  };
  public getUser(userId: string): Observable<StaffUserDetailI> {
    return this.httpClient.get<StaffUserDetailI>(this.apiUrl + "/" + userId);
  };
  public createUser(user_obj: StaffUserDetailI): Observable<StaffUserDetailI> {
    return this.httpClient.post<StaffUserDetailI>(this.apiUrl, user_obj)
  }
  public updateUser(userId: string, user_obj: StaffUserDetailI): Observable<StaffUserDetailI> {
    return this.httpClient.put<StaffUserDetailI>(this.apiUrl + "/" + userId, user_obj);
  };
}
