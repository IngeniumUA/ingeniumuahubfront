import type {ProductOutI} from "$lib/models/productsI";
import {type Enums, PaymentStatusEnum} from "$lib/models/enums";
import type {InteractionI, InteractionLimitedI} from "$lib/models/interactionI";

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
  validity: Enums

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