import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {HttpClient} from '@angular/common/http';
import {setUser}from "@sentry/angular-ivy";
import {UserStateModel} from './user.model';
import {User} from './user.actions';
import {HubAccountData, HubAuthData} from '@ingenium/app/shared/models/user';
import {apiEnviroment} from '@ingenium/environments/environment';
import {tap} from 'rxjs';
import {SsrCookieService} from "ngx-cookie-service-ssr";
import {CartService} from "@ingenium/app/core/services/shop/cart/cart.service";
import {Router} from "@angular/router";

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

  constructor(private httpClient: HttpClient, private cookieService: SsrCookieService, private cartService: CartService, private router: Router) { }

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
        tap((userDetails) => ctx.dispatch(new User.SetAuthData(userDetails)))
      );
  }


  @Action(User.GoogleLogin)
  googleLogin(ctx: StateContext<UserStateModel>, action: User.GoogleLogin) {
    return this.httpClient.get<HubAuthData>(apiEnviroment.apiUrl + 'auth/google?token=' + action.googleAuthToken)
      .pipe(
        tap(userDetails => ctx.dispatch(new User.SetAuthData(userDetails)))
      );
  }


  @Action(User.RefreshToken)
  refreshAccessToken(ctx: StateContext<UserStateModel>, _action: User.RefreshToken) {
    const { token, refreshToken } = ctx.getState();

    return this.httpClient.post<HubAuthData>(apiEnviroment.apiUrl + 'auth/refresh', {
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'bearer'
    }).pipe(
        tap(userDetails => ctx.dispatch(new User.SetAuthData(userDetails)))
      );
  }


  @Action(User.SetAuthData)
  setAuthData(ctx: StateContext<UserStateModel>, action: User.SetAuthData) {
    ctx.setState({
      ...ctx.getState(),
      token: action.userDetails.access_token,
      refreshToken: action.userDetails.refresh_token,
    });

    // Store tokens in cookie
    this.cookieService.set('access_token', action.userDetails.access_token, 1, undefined, undefined, true, 'Strict');
    this.cookieService.set('refresh_token', action.userDetails.refresh_token, 7, undefined, undefined, true, 'Strict');

    // Fetch user details
    return ctx.dispatch(new User.FetchUserDetails());
  }


  @Action(User.FetchAuthTokenFromStorage)
  fetchAuthTokenFromStorage(ctx: StateContext<UserStateModel>) {
    const token: string = this.cookieService.get('access_token');

    if (token) {
      ctx.setState({
        ...ctx.getState(),
        token,
      });

      ctx.dispatch(new User.FetchUserDetails());
    }
  }

  @Action(User.FetchUserDetails)
  fetchUserDetails(ctx: StateContext<UserStateModel>) {
    console.log('Fetching user details')

    return this.httpClient.get<HubAccountData>(apiEnviroment.apiUrl + 'user/account/')
      .pipe(
        tap((userDetails) => {
          ctx.setState({
            ...ctx.getState(),
            userDetails,
          });
        })

        // Retry perhaps if refresh token is implemented?
      );
  }

  @Action(User.RemoveUserDetails)
  removeUserDetails(ctx: StateContext<UserStateModel>) {
    setUser(null);

    ctx.setState({
      ...ctx.getState(),
      userDetails: null,
      token: null,
    });
  }

  @Action(User.Logout)
  logout(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      token: null,
      refreshToken: null,
      userDetails: null,
    });

    this.cookieService.delete('access_token');
    this.cartService.clear();

    this.httpClient.post<any>(apiEnviroment.apiUrl + 'api/auth/logout', {
      access_token: ctx.getState().token, // TODO: This doesn't seem to make much sense, why do I need to sent these tokens like this to logout? Only the access token should be enough and that is already in the header?
      refresh_token: ctx.getState().refreshToken,
      token_type: 'bearer'
    });
    this.router.navigate(['/']);
  }
}
