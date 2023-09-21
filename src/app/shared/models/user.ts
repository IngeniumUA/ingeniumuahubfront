import {HubCardI} from "./card";

export interface HubAuthData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface HubUserRolesI {
  is_manager: boolean
  is_staff: boolean
  is_lid: boolean
}

export interface HubUserPersonalDetailsI {
  first_name: string,
  last_name: string,
  address: string,
}

export interface HubAccountData {
  email: string,
  google_mail: string,
  ua_mail: string,

  roles: HubUserRolesI,
  personal_details: HubUserPersonalDetailsI,

  card_details: HubCardI
}
