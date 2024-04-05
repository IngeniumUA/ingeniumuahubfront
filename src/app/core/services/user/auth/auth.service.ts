import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import { map } from 'rxjs/operators';

import {HubAuthData} from '@ingenium/app/shared/models/user';
import {apiEnviroment} from '@ingenium/environments/environment';
import {RolesService} from '@ingenium/app/core/services/user/roles.service';
import {CartService} from '@ingenium/app/core/services/shop/cart/cart.service';
import {Store} from '@ngxs/store';
import {User} from '@ingenium/app/core/store';
import {isPlatformServer} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<HubAuthData | null>;  // Onthoudt de user, observables subscriben naar dit subject
  public user: Observable<HubAuthData | null>;
  constructor(@Inject(PLATFORM_ID) platformId: object,
              private router: Router,
              private httpClient: HttpClient,
              private cartService: CartService,
              private rolesService: RolesService,
              private store: Store) {
    const authData: HubAuthData | null = null;
    if (!isPlatformServer(platformId)) { // For SSR this may need to be different and data needs to be stored in cookies
      new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    }
    this.userSubject = new BehaviorSubject<HubAuthData | null>(authData);
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  public refreshAccessToken() {
    const body = { access_token: this.userValue?.access_token, refresh_token: this.userValue?.refresh_token, token_type: 'bearer' };

    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'auth/refresh', body)
      .pipe(
        map(user => {
          // store user and jwttoken TODO Move to cookiestorage
          localStorage.setItem('user', JSON.stringify(user));

          this.userSubject.next(user); // Set user observable to user?
          return user;
        })
      );
  }

  // ----------
  // Login methods
  // ----------
  login(email: string, password: string) {
    return this.store.dispatch(new User.LoginUser(email, password));
  }

  public google_login(google_auth_token: string) {
    return this.httpClient.get<HubAuthData>(apiEnviroment.apiUrl + 'auth/google?token=' + google_auth_token).pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user); // Set user observable to user?
        return user;
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => error);
      })
    );
  }
}
