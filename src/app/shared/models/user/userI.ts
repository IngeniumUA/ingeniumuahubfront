import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";

export interface UserI {
  uuid: string

  email: string
  disabled: boolean

  created_timestamp: string
  last_update_timestamp: string
  last_login: string

  manager: boolean

  roles: UserRolesI
}
