import {IProductItem} from "../items/products/products";

export interface StaffInteractionI {
  id: number
  user_id: string
  user_email: string | null
  interaction_type: string
  item_id: string
  item_name: string | null
  date_created: string
}

export interface StaffTransactionI {
  interaction: StaffInteractionI
  product_blueprint_id: number

  product: IProductItem
  count: number
  amount: number
  currency: string

  status: string
  checkout_id: string

  validity: string

  date_created: string
  date_completed: string
}
