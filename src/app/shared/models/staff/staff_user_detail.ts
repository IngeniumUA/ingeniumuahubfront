import {HubUserPersonalDetailsI, UserRolesI} from '../user';
import {HubGroupI} from './HubGroup';

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
