import {CardLimitedI} from '../card';
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";

export interface HubAuthData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface HubUserPersonalDetailsI {
  voornaam: string
  achternaam: string
  telefoonnummer: string
  gemeente: string
  adres: string
  huisnummer: string
  sport_interesse: string
  doop_interesse: string
  afstudeerrichting: string
}

export interface HubAccountData {
  email: string,
  google_mail: string,
  ua_mail: string,

  roles: UserRolesI,
  personal_details: HubUserPersonalDetailsI,

  card_details: CardLimitedI
}
