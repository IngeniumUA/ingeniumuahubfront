import {IProductItem, PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";

export namespace CartActions {
  export class AddToCart {
    static readonly type = '[Cart] Add to Cart';

    constructor(public product: IProductItem, public count: number = 1) {}
  }

  export class RemoveFromCart {
    static readonly type = '[Cart] Remove from Cart';
    constructor(public itemIndex: number) {}
  }

  export class ReduceProductQuantity {
    static readonly type = '[Cart] Reduce Quantity';
    constructor(public product: IProductItem, public count: number = 1) {}
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

  export class Checkout {
    static readonly type = '[Cart] Checkout';
    constructor(public payment_provider: PaymentProviderEnum) {}
  }
}
