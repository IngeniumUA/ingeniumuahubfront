import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import { UserStateModel } from './user.model';
import {User} from './user.actions';
import {HubAccountData, HubUserPersonalDetailsI} from '../../../shared/models/user';
import {apiEnviroment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

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
  constructor(private httpClient: HttpClient) {}

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

  @Action(User.FetchUserDetails)
  fetchUserDetails(ctx: StateContext<UserStateModel>, action: User.FetchUserDetails) {
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

  @Action(User.removeUserDetails)
  removeUserDetails(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      userDetails: null,
    });
  }
}
