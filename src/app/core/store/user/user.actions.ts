export namespace User {

  export class LoginUser {
    static readonly type = '[User] Login';
    constructor(public username: string, public password: string) {}
  }

  export class LoginUserSuccess {
    static readonly type = '[User] Login success';
    constructor(public token: string, public refreshToken: string) {}
  }

  export class LoginUserFailure {
    static readonly type = '[User] Login failure';
    constructor(public error: any) {}
  }

  export class FetchAuthTokenFromStorage {
    static readonly type = '[User] Fetch browser token'
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
