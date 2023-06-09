import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import {HubAuthData} from "../../../../shared/models/user";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<HubAuthData | null>;  // Onthoudt de user, observables subscriben naar dit subject
  public user: Observable<HubAuthData | null>;
  constructor(private router: Router,
              private httpClient: HttpClient) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  public isLoggedIn(): boolean {
    return this.userValue != null
  }

  public get accessToken() {
    return this.userSubject.value?.access;
  }

  login(email: string, password: string) {
    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'api/user/auth/login', { email, password}).pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user); // Set user observable to user?
        return user;
      })
    )
  }

  public refreshAccessToken() {
    const refresh = this.userValue?.refresh;

    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'api/user/auth/refresh', { refresh }).pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user); // Set user observable to user?
        return user;
      })
    )
  };

  logout() {
    const refresh = this.userValue?.refresh;
    this.httpClient.post<any>(apiEnviroment.apiUrl + 'api/user/auth/logout', { refresh })

    localStorage.removeItem('user');
    this.userSubject.next(null); // Set observable to null
    this.router.navigate(['home']);
  }
}
