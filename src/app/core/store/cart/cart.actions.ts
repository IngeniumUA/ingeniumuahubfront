import {ProductOutI, PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {CartFailedI} from "@ingenium/app/shared/models/cart/cartI";

export namespace CartActions {
  export class AddToCart {
    static readonly type = '[Cart] Add to Cart';

    constructor(public product: ProductOutI, public count: number = 1) {}
  }

  export class RemoveFromCart {
    static readonly type = '[Cart] Remove from Cart';
    constructor(public itemIndex: number) {}
  }

  export class ReduceProductQuantity {
    static readonly type = '[Cart] Reduce Quantity';
    constructor(public product: ProductOutI, public count: number = 1) {}
  }

  export class FetchCart {
    static readonly type = '[Cart] Fetch Cart';
  }

  export class StoreInLocalStorage {
    static readonly type = '[Cart] Store InLocal Storage';
  }

  export class ClearCart {
    static readonly type = '[Cart] Clear Cart';
  }

  export class SetPaymentMethod {
    static readonly type = '[Cart] Set Payment Method';
    constructor(public payment_provider: PaymentProviderEnum) { }
  }

  export class SetCheckoutNote {
    static readonly type = '[Cart] Set Checkout Note';
    constructor(public note: string) { }
  }

  export class SetEmail {
    static readonly type = '[Cart] Set E-mail';
    constructor(public email: string) { }
  }

  export class AddCartErrors {
    static readonly type = '[Cart] Add Cart Errors';
    constructor(public errors: CartFailedI|null) {}
  }

  // TODO: Implement this action
  export class Checkout {
    static readonly type = '[Cart] Checkout';
    constructor(public payment_provider: PaymentProviderEnum) {}
  }
}
