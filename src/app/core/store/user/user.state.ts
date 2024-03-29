import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import { UserStateModel } from './user.model';
import {User} from './user.actions';
import {HubAccountData} from '../../../shared/models/user';
import {apiEnviroment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {AuthService} from '../../services/user/auth/auth.service';

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
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

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
    return !!state.userDetails;
  }

  /**
   * Actions
   */

  @Action(User.FetchAuthTokenFromStorage)
  fetchAuthTokenFromStorage(ctx: StateContext<UserStateModel>, _action: User.FetchAuthTokenFromStorage) {
    // Get the JWT token from local storage
    const token = window.localStorage.getItem('token');

    if (token == null) return;

  }

  @Action(User.FetchUserDetails)
  fetchUserDetails(ctx: StateContext<UserStateModel>, _action: User.FetchUserDetails) {
    return this.httpClient.get<HubAccountData>(apiEnviroment.apiUrl + 'user/account/')
      .pipe(
        tap((userDetails) => {
          ctx.setState({
            ...ctx.getState(),
            userDetails
          });
        })
      );
  }

  @Action(User.RemoveUserDetails)
  removeUserDetails(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      userDetails: null,
    });
  }

  @Action(User.Logout)
  logout(ctx: StateContext<UserStateModel>) {
    this.authService.logout();
    console.log('Logout');

    ctx.setState({
      token: null,
      refreshToken: null,
      userDetails: null,
    });
  }
}
