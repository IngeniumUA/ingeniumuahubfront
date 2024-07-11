import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UserStateModel} from './user.model';
import {User} from './user.actions';
import {CartService} from "@ingenium/app/core/services/shop/cart/cart.service";
import {Router} from "@angular/router";
import {OAuthService} from "angular-oauth2-oidc";

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

  constructor(private cartService: CartService, private router: Router, private oauthService: OAuthService) {}

  /**
   * Selectors
   */

  @Selector()
  static token(state: UserStateModel) {
    return state.token;
  }

  @Selector()
  static getEmail(state: UserStateModel) {
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
  static getRoles(state: UserStateModel) {
    return state.roles;
  }

  /**
   * Actions
   */

  @Action(User.Login)
  loginUser(_ctx: StateContext<UserStateModel>, _action: User.Login) {
    this.oauthService.initLoginFlow();
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

    const token = this.oauthService.getAccessToken();
    const email = this.oauthService.getIdentityClaims()['email'];
    ctx.dispatch(new User.SetAuthData(token, email));
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
