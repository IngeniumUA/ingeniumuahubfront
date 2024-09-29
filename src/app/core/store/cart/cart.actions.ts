import {IProductItem} from "@ingenium/app/shared/models/items/products/products";

export namespace CartActions {
  export class AddToCart {
    static readonly type = '[Cart] Add to Cart';

    constructor(public product: IProductItem) {}
  }

  export class RemoveFromCart {
    static readonly type = '[Cart] Remove from Cart';
    constructor(public itemIndex: number) {}
  }

  export class ClearCart {
    static readonly type = '[Cart] Clear Cart';
  }

  export class FetchCart {
    static readonly type = '[Cart] Fetch Cart';
  }

  export class StoreInLocalStorage {
    static readonly type = '[Cart] Store InLocal Storage';
  }

  export class Checkout {
    static readonly type = '[Cart] Checkout';
  }
}
