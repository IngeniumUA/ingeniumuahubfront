import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, throwError} from 'rxjs';
import { map } from 'rxjs/operators';

import {HubAuthData} from "../../../../shared/models/user";
import {apiEnviroment} from "../../../../../environments/environment";
import {RolesService} from "../roles.service";
import {CartService} from "../../shop/cart/cart.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<HubAuthData | null>;  // Onthoudt de user, observables subscriben naar dit subject
  public user: Observable<HubAuthData | null>;
  constructor(private router: Router,
              private httpClient: HttpClient,
              private cartService: CartService,
              private rolesService: RolesService) {
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
    return this.userSubject.value?.access_token;
  }

  public refreshAccessToken() {
    const body = { access_token: this.userValue?.access_token, refresh_token: this.userValue?.refresh_token, token_type: "bearer" };

    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'auth/refresh', body)
      .pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user); // Set user observable to user?
        return user;
      })
    )
  };

  logout() {
    const body = { access_token: this.userValue?.access_token, refresh_token: this.userValue?.refresh_token, token_type: "bearer" };

    this.httpClient.post<any>(apiEnviroment.apiUrl + 'api/auth/logout', body )

    localStorage.removeItem('user');
    this.userSubject.next(null); // Set observable to null
    this.router.navigate(['home']);
  }

  // ----------
  // Login methods
  // ----------
  login(email: string, password: string) {
    let formdata = new FormData()
    formdata.append("username", email)
    formdata.append("password", password)

    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'auth/token', formdata).pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user); // Set user observable to user?

        // Clear cart
        this.cartService.clear()

        return user;
      }),
      catchError((error) => {
        console.log(error)
        return throwError(() => error);
      })
    )
  }

  public google_login(google_auth_token: string) {
    return this.httpClient.get<HubAuthData>(apiEnviroment.apiUrl + "auth/google?token=" + google_auth_token).pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        // Clear cart
        this.cartService.clear()

        this.userSubject.next(user); // Set user observable to user?
        return user;
      }),
      catchError((error) => {
        console.log(error)
        return throwError(() => error);
      })
    )
  }

  signUp(email: string) {
    return this.httpClient.post<any>(apiEnviroment.apiUrl + "user/signup/mail", {email: email})
  }
}
