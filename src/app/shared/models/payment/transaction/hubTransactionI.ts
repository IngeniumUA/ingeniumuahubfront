import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {ValidityEnum} from "@ingenium/app/shared/models/payment/transaction/validityEnum";
import {ProductOutI} from "@ingenium/app/shared/models/product/products";
import {InteractionI, InteractionLimitedI} from "@ingenium/app/shared/models/interaction/hubInteractionI";

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
  completed_timestamp: string | null
  created_timestamp: string

  transaction_status: PaymentStatusEnum
  validity: ValidityEnum

  product_blueprint_id: number
  price_policy_id: number

  product_blueprint_name: string

  checkout_uuid: string

  purchased_product: ProductOutI
  note: string | null
}

export interface TransactionPatchI {
  validity: string | null
  user: string | null
  user_uuid: string | null
  product_blueprint_id: number | null
}

export interface TransactionLimitedI {
  interaction: InteractionLimitedI
  purchased_product: ProductOutI
  note: string
  completed_timestamp: string | null
}
