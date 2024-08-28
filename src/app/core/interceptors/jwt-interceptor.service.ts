import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';

import {Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {User, UserState} from "@ingenium/app/core/store";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  constructor(private store: Store, private router: Router) { }

  /**
   * Intercepts the request and adds the JWT token to the header if the user is logged in
   * @param request
   * @param next
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with access if user is logged in and request is to api
    const isApiUrl = true; // TODO request.url.startsWith('')

    if (isApiUrl && this.store.selectSnapshot(UserState.isAuthenticated) && !request.url.includes('auth/refresh')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`
        }
      });
    }

    // Every intercept ends with next.handle() ?
    return next.handle(request).pipe(
      catchError((error) => {
        // Check if error is 401 (not authorised)
        if (error instanceof HttpErrorResponse && !request.url.includes('auth/login') && error.status === 401) {
          return this.handleUnAuthorisedError(request, next);
        }

        // Check if error is 403 (forbidden)
        if (error instanceof HttpErrorResponse && !request.url.includes('auth/login') && error.status === 403) {
          // If forbidden is found, route to home
          this.router.navigate(['/']);
        }

        // Else continuing throwing error
        return throwError(() => error);
      })
    );
  }

  /**
   * Handles the unauthorised error
   * @param request
   * @param next
   * @private
   */
  private handleUnAuthorisedError(request: HttpRequest<any>, next: HttpHandler) {
    // 1) If already refreshing, handle next
    if (this.isRefreshing) {
      return next.handle(request);
    }

    this.isRefreshing = true; // Not refreshing yet, set bool to true

    // 2) Check if user is logged in (if we have a refresh token to attempt a refresh with)
    if (!this.store.selectSnapshot(UserState.isAuthenticated)) {
      return next.handle(request);
    }

    // 3) Else, attempt to refresh
    return this.store.dispatch(new User.RefreshToken).pipe(
      // .pipe() means request is finished, two cases can occur:

      // Case 1) If Refresh successful, set refreshing to False and continue to next request ( usually redo )
      switchMap(() => {
        this.isRefreshing = false;

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`
          }
        });
        return next.handle(request);
      }),
      // Case 2) If error, check error
      catchError((error) => {
        this.isRefreshing = false;

        // If any error occurs, simply logout the user
        //this.store.dispatch(new User.Logout);
        // TODO: TEMPORARILY DISABLED THIS SO THE BACKEND CAN BE UPDATED!

        // Continue throwing error
        return throwError(() => error);
      })
    );
  }
}
