import {ProductOutI, PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {CartFailedI} from "@ingenium/app/shared/models/cart/cartI";

export interface CartTransactionI extends ProductOutI {
  user_email: string|null;
}

export interface CartStateModel {
  products: ProductOutI[];
  paymentProvider: PaymentProviderEnum,
  checkoutNote: string;
  failedCart: null|CartFailedI;
  user_email: string|null,
  captchaToken: string|null;
}
