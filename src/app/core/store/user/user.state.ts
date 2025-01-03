import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UserStateModel} from './user.model';
import {User} from './user.actions';
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";
import {HttpClient} from "@angular/common/http";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {apiEnviroment} from "@ingenium/environments/environment";
import {catchError, of} from "rxjs";
import {map} from "rxjs/operators";
import {CartActions} from "@ingenium/app/core/store";
import {isPlatformServer} from "@angular/common";

@State<UserStateModel>({
  name: 'user',
  defaults: {
    token: null,
    email: null,
    personalDetails: null,
    roles: null,
    cardDetails: null,
  },
})
@Injectable()
export class UserState {

  constructor(private router: Router, private oauthService: OAuthService,
              private httpClient: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {}
  /**
   * Selectors
   */

  @Selector()
  static token(state: UserStateModel) {
    return state.token;
  }

  @Selector()
  static email(state: UserStateModel) {
    return state.email;
  }

  @Selector()
  static userDetails(state: UserStateModel) {
    return state.personalDetails;
  }

  @Selector()
  static isAuthenticated(state: UserStateModel) {
    return !!state.token;
  }

  @Selector()
  static roles(state: UserStateModel) {
    return state.roles;
  }

  /**
   * Actions
   */

  @Action(User.Login)
  loginUser(_ctx: StateContext<UserStateModel>, action: User.Login) {
    if (isPlatformServer(this.platformId)) return;

    // Check if the current host matches the environment, if not redirect
    if (window.location.host !== apiEnviroment.appHost) {
      console.log("Not at correct address for logging in.");
      window.location.href = `${window.location.protocol}//${apiEnviroment.appHost}/auth/login?dest=${action.destinationPath}`;
      return;
    }

    this.oauthService.initLoginFlow(action.destinationPath);
  }

  @Action(User.GetRoles)
  getRoles(ctx: StateContext<UserStateModel>) {
    const emptyRoles: UserRolesI = {
      is_manager: false,
      is_webmaster: false,
      is_staff: false,
      is_lid: false,
    };

    this.httpClient.get<UserRolesI>(`${apiEnviroment.apiUrl}account/roles`)
      .pipe(
        map((roles: UserRolesI|null) => roles),
        catchError((_) => {
          return of(null);
        })
      )
      .subscribe((roles: UserRolesI|null) => {
        if (roles === null) {
          ctx.patchState({
            roles: emptyRoles,
          });
        }

        ctx.patchState({
          roles
        });
      });
  }

  @Action(User.RefreshToken)
  refreshAccessToken(_ctx: StateContext<UserStateModel>, _action: User.RefreshToken) {
    // ...
  }

  @Action(User.FetchAuthTokenFromStorage)
  fetchAuthTokenFromStorage(ctx: StateContext<UserStateModel>, action: User.FetchAuthTokenFromStorage) {
    if (!this.oauthService.hasValidAccessToken()) {
      return;
    }

    // Set required auth parameters
    const token = this.oauthService.getAccessToken();
    const email = this.oauthService.getIdentityClaims()['email'];
    ctx.dispatch(new User.SetAuthData(token, email));

    if (action.shouldGetRoles) {
      ctx.dispatch(new User.GetRoles());
    }
  }

  @Action(User.SetAuthData)
  setAuthData(ctx: StateContext<UserStateModel>, action: User.SetAuthData) {
    ctx.setState({
      ...ctx.getState(),
      token: action.token,
      email: action.email,
    });
  }

  @Action(User.Logout)
  logout(ctx: StateContext<UserStateModel>, action: User.Logout) {
    ctx.setState({
      token: null,
      email: null,
      personalDetails: null,
      roles: null,
      cardDetails: null,
    });

    const queryParams = new URLSearchParams();
    queryParams.set('has_error', String(action.authError));

    ctx.dispatch(new CartActions.ClearCart());
    this.oauthService.revokeTokenAndLogout({
      client_id: apiEnviroment.oauthConfig.clientId,
      redirect_uri: apiEnviroment.oauthConfig.postLogoutRedirectUri + `?${queryParams.toString()}`,
    });
    this.router.navigate(['/']);
  }
}
