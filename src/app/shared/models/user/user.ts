import {CardLimitedI} from '../card';
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";

export interface HubAuthData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface HubUserPersonalDetailsI {
  given_name: '',
  last_name: '',
  telephone: string,
  recreation_interest: boolean,
  sport_interest: boolean,
  relations_interest: boolean,
  graduation_tract: string,
}

export interface HubAccountData {
  email: string,
  google_mail: string,
  ua_mail: string,

  roles: UserRolesI,
  personal_details: HubUserPersonalDetailsI,

  card_details: CardLimitedI
}
