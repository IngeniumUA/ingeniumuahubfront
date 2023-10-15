import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {HubAuthData, HubUserRolesI} from "../../../shared/models/user";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {apiEnviroment} from "../../../../enviroments";


@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private router: Router,
              private httpClient: HttpClient) {
  }

  savedRoles: HubUserRolesI = {is_staff: false, is_manager: false, is_lid: false}
  lastUpdated: Date | null = null

  public setRoles(roles: HubUserRolesI) {
    this.savedRoles = roles;
    this.lastUpdated = new Date()
  }

  public getRoles(): Observable<HubUserRolesI> {
    if (!(this.lastUpdated === null)) {

    }
    return this.httpClient.get<HubUserRolesI>(apiEnviroment.apiUrl.apiUrl + "user/account/roles").pipe(shareReplay())
  }

  public get isStaff(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value)
          return value.is_staff
    }))
  }

  public get isLid(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value)
          return value.is_lid
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
