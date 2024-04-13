import {IProductItem} from '../items/products/products';

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
  product_blueprint_name: string | null

  product: IProductItem
  count: number
  amount: number
  currency: string

  status: string
  checkout_id: string

  validity: string

  date_created: string
  date_completed: string

  note: string | null
}

export interface StaffTransactionPatchI {
  validity: string | null
  user: string | null
  user_id: string | null
  product: IProductItem | null
}

export interface StaffCreateTransactionI {
  user: string
  item_id: string
  product: IProductItem
  validity: number
  count: number
}
