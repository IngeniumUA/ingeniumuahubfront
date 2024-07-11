export namespace User {
  export class Login {
    static readonly type = '[User] Login';
    constructor() {}
  }

  export class RefreshToken {
    static readonly type = '[User] Refresh Token';
    constructor() {}
  }

  export class SetAuthData {
    static readonly type = '[User] Set Auth Data';
    constructor(public token: string, public email: string) {}
  }

  export class FetchAuthTokenFromStorage {
    static readonly type = '[User] Fetch browser token';
  }

  export class FetchUserDetails {
    static readonly type =  '[User] Fetch User Details';
  }

  export class Logout {
    static readonly type = '[User] Logout';
  }
}
