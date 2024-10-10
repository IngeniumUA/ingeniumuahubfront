import {TransactionInI} from "@ingenium/app/shared/models/transaction/transaction_models";

export interface CheckoutInI {
  user_email: string;
  payment_provider: number

  transactions: TransactionInI[]
  note: number | null
}
