import {HubUserPersonalDetailsI, HubUserRolesI} from "../user";
import {HubGroupI} from "./HubGroup";

export interface StaffUserDetailI {
  uuid: string
  is_active: boolean
  prefered_email: string

  email: string
  mail_verified: boolean
  google_email: string
  google_verified: boolean

  created_at: string
  modified_at: string
  last_login: string

  is_manager: boolean

  groups: HubGroupI[]
  roles: HubUserRolesI
  user_detail: HubUserPersonalDetailsI
}
