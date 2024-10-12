export enum AccessPolicyEnum {
  always_available = 0,  // Always available is stored as 'None' or 'Null' value in db
  member_of_group = 1
}

export interface AllowDenyListI {
    whitelist: number[] | null
    blacklist: number[] | null
}
