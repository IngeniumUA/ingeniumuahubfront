import { Injectable } from '@angular/core';
import {HubAuthData} from '../../../shared/models/user';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: HubAuthData): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): HubAuthData | null {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    return !!user; // If user return True


  }
}
