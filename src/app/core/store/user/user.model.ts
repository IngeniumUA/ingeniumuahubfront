import {CardLimitedI} from "@ingenium/app/shared/models/card";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {AccountI} from "@ingenium/app/shared/models/user/accountI";

export interface UserStateModel {
  token: string | null;
  email: string | null;
  roles: UserRolesI | null,
  personalDetails: AccountI | null,
  cardDetails: CardLimitedI | null,
}
