import {IProductItem, PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";

export interface CartStateModel {
  products: IProductItem[];
  paymentProvider: PaymentProviderEnum,
  checkoutNote: string;
}
