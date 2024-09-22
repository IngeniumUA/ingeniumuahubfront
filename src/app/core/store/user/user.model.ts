import {HubUserPersonalDetailsI} from "@ingenium/app/shared/models/user/user";
import {CardLimitedI} from "@ingenium/app/shared/models/card";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";

export interface UserStateModel {
  token: string | null;
  email: string | null;
  roles: UserRolesI | null,
  personalDetails: HubUserPersonalDetailsI | null,
  cardDetails: CardLimitedI | null,
}
