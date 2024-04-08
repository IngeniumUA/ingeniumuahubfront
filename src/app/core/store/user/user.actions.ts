import {HubAuthData} from "@ingenium/app/shared/models/user";

export namespace User {

  export class LoginUser {
    static readonly type = '[User] Login';
    constructor(public username: string, public password: string) {}
  }

  export class GoogleLogin {
    static readonly type = '[User] Google Login';
    constructor(public googleAuthToken: string) {}
  }

  export class RefreshToken {
    static readonly type = '[User] Refresh Token';
    constructor() {}
  }

  export class SetAuthData {
    static readonly type = '[User] Set Auth Data';
    constructor(public userDetails: HubAuthData) {}
  }

  export class FetchAuthTokenFromStorage {
    static readonly type = '[User] Fetch browser token';
  }

  export class FetchUserDetails {
    static readonly type =  '[User] Fetch User Details';
  }

  export class RemoveUserDetails {
    static readonly type = '[User] Logout';
  }

  export class Logout {
    static readonly type = '[User] Logout';
  }
}
