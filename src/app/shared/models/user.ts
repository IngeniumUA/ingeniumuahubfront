import {HubCardI} from './card';

export interface HubAuthData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserRolesI {
  is_manager: boolean
  is_webmaster: boolean
  is_staff: boolean
  is_lid: boolean
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

  card_details: HubCardI
}
