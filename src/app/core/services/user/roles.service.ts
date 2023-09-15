import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
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

  savedRoles: UserRolesI = {is_staff: false, is_manager: false}
  lastUpdated: Date | null = null

  public setRoles(roles: UserRolesI) {
    this.savedRoles = roles;
    this.lastUpdated = new Date()
  }

  public getRoles(): Observable<UserRolesI> {
    if (!(this.lastUpdated === null)) {

    }
    return this.httpClient.get<UserRolesI>(apiEnviroment.apiUrl + "roles").pipe(shareReplay())
  }

  public get isStaff(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value)
          return value.is_staff
    }))
  }

  public get isWebmaster(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value)
          return value.is_manager // TODO
        }))
  }

  public get isManager(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value)
          return value.is_manager
        }))
  }
}
