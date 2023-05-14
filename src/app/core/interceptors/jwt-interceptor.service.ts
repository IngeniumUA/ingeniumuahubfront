import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';

import {AuthService} from "../services/user/auth/auth.service";
@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with access if user is logged in and request is to api
    const isApiUrl = true // TODO request.url.startsWith('')

    if (isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.accessToken}`
        }
      })
    }

    // Every intercept ends with next.handle() ?
    return next.handle(request).pipe(
      catchError((error) => {
        // Check if error is 401 (not authorised)
        if (error instanceof HttpErrorResponse &&
            !request.url.includes('auth/login') &&
            error.status === 401) {
          return this.handleUnAuthorisedError(request, next);
        }

        // Else continuing throwing error
        return throwError(() => error);
      })
    );
  }

  private handleUnAuthorisedError(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;}

    //Check if user is logged in ( if we should attempt to refresh)
    if (!this.authService.user) {
      return next.handle(request);
    }

    // Else, attempt to refresh
    return this.authService.refreshAccessToken().pipe(
      // .pipe() means request is finished, if successfull, set refreshing to False and continue to next request
      switchMap(() => {
        this.isRefreshing = false;
        return next.handle(request);
      }),
      // Else, if error, check error
      catchError((error) => {
        this.isRefreshing = false;

        if (error.status == '403') {  // 403 means Forbidden
          this.authService.logout();
        }

        // Continue throwing error
        return throwError(() => error);
    })
    )
  }
}
