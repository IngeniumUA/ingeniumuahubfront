import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {GroupI} from "@ingenium/app/shared/models/group/HubGroup";

import {AccountI} from "@ingenium/app/shared/models/user/accountI";

export interface UserI {
  user_uuid: string

  email: string
  disabled: boolean

  created_timestamp: string
  last_update_timestamp: string
  last_login: string

  manager: boolean

  roles: UserRolesI
}

export interface UserWideI {
  user_uuid: string

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
