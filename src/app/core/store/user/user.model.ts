import { HubAccountData } from "../../../shared/models/user";

export interface UserStateModel {
  token: string | null;
  refreshToken: string | null;
  userDetails: HubAccountData | null;
}
