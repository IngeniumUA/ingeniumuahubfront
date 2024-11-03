import {ProductOutI, PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";

export interface CartStateModel {
  products: ProductOutI[];
  paymentProvider: PaymentProviderEnum,
  checkoutNote: string;
}
