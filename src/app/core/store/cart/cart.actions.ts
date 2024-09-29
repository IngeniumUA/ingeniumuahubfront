import {IProductItem} from "@ingenium/app/shared/models/items/products/products";

export namespace CartActions {
  export class AddToCart {
    static readonly type = '[Cart] Add to Cart';

    constructor(public product: IProductItem) {}
  }

  export class RemoveFromCart {
    static readonly type = '[Cart] Remove from Cart';

    constructor(public productId: string) {
    }
  }

  export class ClearCart {
    static readonly type = '[Cart] Clear Cart';
  }

  export class FetchCart {
    static readonly type = '[Cart] Fetch Cart';
  }

  export class SetCart {
    static readonly type = '[Cart] Set Cart';

    constructor(public cart: any) {}
  }

  export class StoreInLocalStorage {
    static readonly type = '[Cart] Store InLocal Storage';
    constructor() {}
  }
}
