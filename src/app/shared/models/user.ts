export interface HubAuthData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface HubAuthGroups {
  groups: number[];
}

export interface HubAccountData {
  email: string;
  first_name: string;
  family_name: string;
  date_of_birth: string;
  home_address: string;
  facturation_address: string;
  telephone_number: string;

  receive_mail: boolean;
  soc_interested: boolean;
  doop_interested: boolean;
}
