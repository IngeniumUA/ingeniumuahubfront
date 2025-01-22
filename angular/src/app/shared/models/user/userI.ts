import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {GroupI} from "@ingenium/app/shared/models/group/hubGroupI";

import {AccountI} from "@ingenium/app/shared/models/user/accountI";

export interface UserI {
  // PRIVATE model for user information

  user_uuid: string
  sso_uuid: string | null

  email: string
  disabled: boolean

  created_timestamp: string
  last_update_timestamp: string
  last_login: string

  manager: boolean

  roles: UserRolesI
}

export interface UserWideI {
  // PRIVATE model for user information, including prefetched groups and account info

  user_uuid: string
  sso_uuid: string | null
  first_name: string | null
  last_name: string | null

  email: string
  disabled: boolean

  created_timestamp: string
  last_update_timestamp: string
  last_login: string

  manager: boolean

  roles: UserRolesI

  account: AccountI
  groups: GroupI[]
}
