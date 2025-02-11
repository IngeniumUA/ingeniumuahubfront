export namespace User {
  export class Login {
    static readonly type = '[User] Login';
    constructor(public destinationPath: string = "/") {}
  }

  export class RefreshToken {
    static readonly type = '[User] Refresh Token';
    constructor() {}
  }

  export class SetAuthData {
    static readonly type = '[User] Set Auth Data';
    constructor(public token: string, public email: string, public roles: string[]) {}
  }

  export class FetchAuthTokenFromStorage {
    static readonly type = '[User] Fetch browser token';
    constructor() {}
  }

  export class Logout {
    static readonly type = '[User] Logout';

    constructor(public authError: boolean = false) {}
  }
}
