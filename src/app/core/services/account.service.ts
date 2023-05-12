import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {HubUser} from "../../shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<HubUser | null>;  // Onthoudt de user, observables subscriben naar dit subject
  public user: Observable<HubUser | null>
  constructor(private router: Router,
              private httpClient: HttpClient) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  public get accessToken() {
    return this.userSubject.value?.access;
  }

  login(email: string, password: string) {
    return this.httpClient.post<HubUser>('http://127.0.0.1:8000/api/user/token/login', { email, password}).pipe(
      map(user => {
        // store user and jwttoken TODO Move to cookiestorage
        localStorage.setItem('user', JSON.stringify(user));

        this.userSubject.next(user); // Set user observable to user?
        return user;
      })
    )
  }

  logout() {
    // TODO, post refreshtoken to '.../api/user/token/logout'

    localStorage.removeItem('user');
    this.userSubject.next(null); // Set observable to null
    this.router.navigate(['home']);
  }


}
