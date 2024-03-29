export namespace User {
  export class FetchAuthTokenFromStorage {
    static readonly type = '[User] Fetch browser token'
  }

  export class FetchUserDetails {
    static readonly type = '[User] Login';
  }

  export class RemoveUserDetails {
    static readonly type = '[User] Logout';
  }

  export class Logout {
    static readonly type = '[User] Logout';
  }
}
