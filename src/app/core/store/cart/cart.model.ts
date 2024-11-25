import {ProductOutI, PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {CartFailedI} from "@ingenium/app/shared/models/cart/cartI";

export interface CartStateModel {
  products: ProductOutI[];
  paymentProvider: PaymentProviderEnum,
  checkoutNote: string;
  failedCart: null|CartFailedI;
}
