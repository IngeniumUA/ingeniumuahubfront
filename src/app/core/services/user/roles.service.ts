import { Injectable } from '@angular/core';
import {Observable, of, shareReplay} from 'rxjs';
import {HubUserRolesI} from '../../../shared/models/user';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {apiEnviroment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private router: Router,
              private httpClient: HttpClient) {
  }

  savedRoles: HubUserRolesI = {is_staff: false, is_manager: false, is_webmaster: false, is_lid: false};
  lastUpdated: Date | null = null;

  public setRoles(roles: HubUserRolesI) {
    this.savedRoles = roles;
    this.lastUpdated = new Date();
  }

  public getRoles(): Observable<HubUserRolesI> {
    if (!(this.lastUpdated === null)) {
      return of(this.savedRoles);
    }
    return this.httpClient.get<HubUserRolesI>(apiEnviroment.apiUrl + 'user/account/roles').pipe(shareReplay());
  }

  public get isStaff(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value);
          return value.is_staff;
        }));
  }

  public get isLid(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value);
          return value.is_lid;
        }));
  }

  public get isWebmaster(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value);
          return value.is_manager; // TODO
        }));
  }

  public get isManager(): Observable<boolean> {
    return this.getRoles()
      .pipe(
        map((value) => {
          this.setRoles(value);
          return value.is_manager;
        }));
  }
}
