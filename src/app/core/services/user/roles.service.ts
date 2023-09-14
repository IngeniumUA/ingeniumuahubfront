import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import {HubAuthData} from "../../../shared/models/user";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {apiEnviroment} from "../../../../enviroments";

export interface UserRolesI {
  is_manager: boolean
  is_staff: boolean
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private router: Router,
              private httpClient: HttpClient) {
  }

  public get isStaff(): Observable<boolean> {
    return this.httpClient.get<UserRolesI>(apiEnviroment.apiUrl + "roles")
      .pipe(
        map((value) => {
          if (value === null) {return false}
          return value.is_staff
    }))
  }
}
