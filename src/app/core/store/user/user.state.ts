import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {HttpClient} from '@angular/common/http';
import { setUser }from "@sentry/angular-ivy";
import Cookies from 'js-cookie';
import { UserStateModel } from './user.model';
import {User} from './user.actions';
import {HubAccountData, HubAuthData} from '@ingenium/app/shared/models/user';
import {apiEnviroment} from '@ingenium/environments/environment';
import {catchError, tap} from 'rxjs';
import {isPlatformServer} from "@angular/common";

@State<UserStateModel>({
  name: 'user',
  defaults: {
    token: null,
    refreshToken: null,
    userDetails: null,
  },
})
@Injectable()
export class UserState {

  constructor(private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * Selectors
   */

  @Selector()
  static token(state: UserStateModel) {
    return state.token;
  }

  @Selector()
  static userDetails(state: UserStateModel) {
    return state.userDetails;
  }

  @Selector()
  static isAuthenticated(state: UserStateModel) {
    return !!state.token;
  }

  @Selector()
  static getRoles(state: UserStateModel) {
    return state.userDetails?.roles;
  }

  /**
   * Actions
   */

  @Action(User.LoginUser)
  loginUser(ctx: StateContext<UserStateModel>, action: User.LoginUser) {
    const formData = new FormData();
    formData.append('username', action.username);
    formData.append('password', action.password);

    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'auth/token', formData)
      .pipe(
        tap((userDetails) => {
          ctx.setState({
            ...ctx.getState(),
            token: userDetails.access_token,
            refreshToken: userDetails.refresh_token,
          });

          // Store tokens in cookie
          Cookies.set('access_token', userDetails.access_token, { secure: true, sameSite: 'strict' });
          Cookies.set('refresh_token', userDetails.refresh_token, { secure: true, sameSite: 'strict' });

          // Fetch user details
          ctx.dispatch(new User.FetchUserDetails());
        })
      );
  }


  @Action(User.FetchAuthTokenFromStorage)
  fetchAuthTokenFromStorage(ctx: StateContext<UserStateModel>) {
    let token: string|undefined;
    if (isPlatformServer(this.platformId)) {
      // TODO: Implement cookie storage for SSR
      console.warn('SSR not implemented yet')
    } else {
      token = Cookies.get('access_token');
    }

    if (token) {
      ctx.setState({
        ...ctx.getState(),
        token,
      });

      ctx.dispatch(new User.FetchUserDetails());
    }

    // We can possibly return dispatches (in if statement and here).
  }

  @Action(User.FetchUserDetails)
  fetchUserDetails(ctx: StateContext<UserStateModel>) {
    return this.httpClient.get<HubAccountData>(apiEnviroment.apiUrl + 'user/account/')
      .pipe(
        tap((userDetails) => {
          ctx.setState({
            ...ctx.getState(),
            userDetails
          });
        }),
        catchError((error) => {
          // If the error is 401, we should log out the user
          if (error.status === 401) {
            ctx.dispatch(new User.Logout());
          }
          return error;
        }
      ));
  }

  @Action(User.RemoveUserDetails)
  removeUserDetails(ctx: StateContext<UserStateModel>) {
    setUser(null);

    ctx.setState({
      ...ctx.getState(),
      userDetails: null,
    });
  }

  @Action(User.Logout)
  logout(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      token: null,
      refreshToken: null,
      userDetails: null,
    });
  }
}
