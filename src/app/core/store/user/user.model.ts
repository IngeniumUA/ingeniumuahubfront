import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {AccountI} from "@ingenium/app/shared/models/user/accountI";
import {CardItemLimitedI} from "@ingenium/app/shared/models/item/cardI";

export interface UserStateModel {
  token: string | null;
  email: string | null;
  roles: UserRolesI | null,
  personalDetails: AccountI | null,
  cardDetails: CardItemLimitedI | null,
}
