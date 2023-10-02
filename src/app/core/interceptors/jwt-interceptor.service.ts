import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';

import {AuthService} from "../services/user/auth/auth.service";
import {Router} from "@angular/router";
@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  constructor(private authService: AuthService,
              private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with access if user is logged in and request is to api
    const isApiUrl = true // TODO request.url.startsWith('')

    if (isApiUrl && this.authService.isLoggedIn() && !request.url.includes('auth/refresh')) {
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

        // Check if error is 403 (forbidden)
        if (error instanceof HttpErrorResponse &&
          !request.url.includes('auth/login') &&
          error.status === 403) {
          // If forbidden is found, route to home
          this.router.navigate(['/home'])
        }

        // Else continuing throwing error
        return throwError(() => error);
      })
    );
  }
  private handleUnAuthorisedError(request: HttpRequest<any>, next: HttpHandler) {
    // 1) If already refreshing, handle next
    if (this.isRefreshing) {
      return next.handle(request);
    }
    this.isRefreshing = true; // Not refreshing yet, set bool to true


    // 2) Check if user is logged in (if we have a refreshtoken to attempt a refresh with)
    if (!this.authService.isLoggedIn()) {
      return next.handle(request);
    }

    // 3) Else, attempt to refresh
    return this.authService.refreshAccessToken().pipe(
      // .pipe() means request is finished, two cases can occur:

      // Case 1) If Refresh successful, set refreshing to False and continue to next request ( usually redo )
      switchMap(() => {
        this.isRefreshing = false;

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authService.accessToken}`
          }
        })
        return next.handle(request);
      }),
      // Case 2) If error, check error
      catchError((error) => {
        this.isRefreshing = false;

        // TODO Maybe match on a couple status codes instead of all errors?
        // if (error.status == '401') {  // 401 means unauthenticated
        this.authService.logout();

        // Continue throwing error
        return throwError(() => error);
    })
    );
  }
}
