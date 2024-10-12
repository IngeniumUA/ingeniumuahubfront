import {InteractionI} from "@ingenium/app/core/services/user/account/account.service";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {ValidityEnum} from "@ingenium/app/shared/models/transaction/validityEnum";
import {IProductItem} from "@ingenium/app/shared/models/items/products/products";

export interface TransactionInI {
  user_email: string;
  item_id: number;
  product_blueprint_id: number;
  price_policy_id: number;
  status: number
  validity: number
}

export interface TransactionI {
  interaction: InteractionI
  completed_timestamp: string
  created_timestamp: string

  transaction_status: PaymentStatusEnum
  validity: ValidityEnum

  product_blueprint_id: number
  price_policy_id: number
  checkout_uuid: string

  purchased_product: IProductItem
  note: string | null
}
