import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UserStateModel} from './user.model';
import {User} from './user.actions';
import {CartService} from "@ingenium/app/core/services/shop/cart/cart.service";
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";
import {HttpClient} from "@angular/common/http";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {apiEnviroment} from "@ingenium/environments/environment";

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

  constructor(private cartService: CartService, private router: Router, private oauthService: OAuthService,
              private httpClient: HttpClient) {}

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
    this.oauthService.initLoginFlow(action.destinationPath);
  }

  @Action(User.GetRoles)
  getRoles(ctx: StateContext<UserStateModel>) {
    this.httpClient.get<UserRolesI>(`${apiEnviroment.apiUrl}account/roles`).subscribe((roles: UserRolesI|null) => {
      ctx.patchState({
        roles,
      });
    });
  }

  @Action(User.RefreshToken)
  refreshAccessToken(_ctx: StateContext<UserStateModel>, _action: User.RefreshToken) {
    // ...
  }

  @Action(User.FetchAuthTokenFromStorage)
  fetchAuthTokenFromStorage(ctx: StateContext<UserStateModel>, _action: User.FetchAuthTokenFromStorage) {
    if (!this.oauthService.hasValidAccessToken()) {
      return;
    }

    // Set required auth parameters
    const token = this.oauthService.getAccessToken();
    const email = this.oauthService.getIdentityClaims()['email'];
    ctx.dispatch(new User.SetAuthData(token, email));

    // Request user roles
    ctx.dispatch(new User.GetRoles());
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
  logout(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      token: null,
      email: null,
      personalDetails: null,
      roles: null,
      cardDetails: null,
    });

    this.cartService.clear();
    this.oauthService.revokeTokenAndLogout();
    this.router.navigate(['/']);
  }
}
