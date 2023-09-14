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
}
