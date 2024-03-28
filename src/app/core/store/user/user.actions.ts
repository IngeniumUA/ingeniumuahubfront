
export namespace User {
  export class FetchUserDetails {
    static readonly type = '[User] Login';
  }

  export class removeUserDetails {
    static readonly type = '[User] Logout';
  }

  export class Logout {
    static readonly type = '[User] Logout';
  }
}
