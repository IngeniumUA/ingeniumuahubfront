import {HubUserPersonalDetailsI, UserRolesI} from "@ingenium/app/shared/models/user";
import {HubCardI} from "@ingenium/app/shared/models/card";

export interface UserStateModel {
  token: string | null;
  email: string | null;
  roles: UserRolesI | null,
  personalDetails: HubUserPersonalDetailsI | null,
  cardDetails: HubCardI | null,
}
