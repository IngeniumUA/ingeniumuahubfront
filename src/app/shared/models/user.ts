export interface HubAuthData {
  id?: string;
  access?: string;
  refresh?: string;
}

export interface HubAuthGroups {
  groups: number[];
}

export class HubAccountData {
  email?: string;
  first_name?: string;
  family_name?: string;
  date_of_birth?: string;
  home_address?: string;
  facturation_address?: string;
  telephone_number?: string;

  receive_mail?: boolean;
  soc_interested?: boolean;
  doop_interested?: boolean;
}
