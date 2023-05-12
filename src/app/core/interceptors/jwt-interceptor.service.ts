import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import {AccountService} from "../services/account.service";
@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with access if user is logged in and request is to api
    const isApiUrl = true // TODO request.url.startsWith('')

    if (isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.accountService.accessToken}`
        }
      })
    }

    // Every intercept ends with next.handle() ?
    return next.handle(request);
  }
}
