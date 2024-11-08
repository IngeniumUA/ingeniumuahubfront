import {Action,createSelector, NgxsOnInit, Selector, State, StateContext} from "@ngxs/store";
import {CartActions, CartStateModel} from "@ingenium/app/core/store";
import {Injectable} from "@angular/core";
import {IProductItem, PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";
import {removeItem} from "@ngxs/store/operators";

// @ts-expect-error
import structuredClone from '@ungap/structured-clone';

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    products: [],
    paymentProvider: PaymentProviderEnum.Stripe,
    checkoutNote: ''
  },
})
@Injectable()
export class CartState implements NgxsOnInit {
  constructor() {}

  ngxsOnInit(ctx: StateContext<CartStateModel>): void {
    const localStorageState = window.localStorage.getItem('cart-products');
    if (localStorageState) {
      ctx.patchState({
        products: JSON.parse(localStorageState),
      })
    }
  }

  @Selector()
  static getPaymentProvider(state: CartStateModel): PaymentProviderEnum {
    console.log(state);
    return state.paymentProvider;
  }

  @Selector()
  static getCheckoutNote(state: CartStateModel): string {
    return state.checkoutNote;
  }

  @Selector()
  static getTotalPrice(state: CartStateModel): number {
    return state.products
      .reduce((sum, product) => sum + product.price_policy.price, 0);
  }

  @Selector()
  static getProducts(state: CartStateModel): IProductItem[] {
    return state.products;
  }

  @Selector()
  static getProductCount(state: CartStateModel): number {
    return state.products.length;
  }


  /**
   * Get the quantity of the product in the cart.
   * @param product the product you which to check
   * @param checkPricePolicy true if you should match on price policy too. Default = false
   */
  static getProductQuantity(product: IProductItem, checkPricePolicy: boolean = false) {
    return createSelector([CartState], (state: CartStateModel): number => {
      return state.products.filter((p) => {
        const isSameProduct = p.id === product.id;
        if (checkPricePolicy) {
          return isSameProduct && p.price_policy.id === product.price_policy.id;
        }
        return isSameProduct;
      }).length;
    });
  }

  // =======================================

  @Action(CartActions.FetchCart)
  fetchCart(_ctx: StateContext<CartStateModel>) {

  }

  @Action(CartActions.AddToCart)
  addToCart(ctx: StateContext<CartStateModel>, action: CartActions.AddToCart) {
    const productsToAdd: IProductItem[] = [];
    while (action.count > 0) {
      productsToAdd.push(structuredClone(action.product));
      action.count--;
    }

    ctx.patchState({
      products: [
        ...ctx.getState().products,
        ...productsToAdd
      ]
    });

    ctx.dispatch(new CartActions.StoreInLocalStorage());
  }

  @Action(CartActions.RemoveFromCart)
  removeFromCart(ctx: StateContext<CartStateModel>, action: CartActions.RemoveFromCart) {
    ctx.patchState({
      products: removeItem<IProductItem>(action.itemIndex)(ctx.getState().products)
    });
    ctx.dispatch(new CartActions.StoreInLocalStorage());
  }

  @Action(CartActions.ReduceProductQuantity)
  reduceProductQuantity(ctx: StateContext<CartStateModel>, action: CartActions.ReduceProductQuantity) {
    // Find products in the cart with the same id
    // Using findIndex is easier, but we may need all the indexes in the future
    const foundIndexes = ctx.getState().products.reduce((acc, product, index, _) => {
      if (product.id === action.product.id && product.price_policy.id === action.product.price_policy.id) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
    if (foundIndexes.length <= 0) return;

    let countToRemove = Math.min(foundIndexes.length, action.count);
    while (countToRemove > 0) {
      ctx.dispatch(new CartActions.RemoveFromCart(foundIndexes[
        --countToRemove
        ]));
    }
  }

  @Action(CartActions.StoreInLocalStorage)
  storeInLocalStorage(ctx: StateContext<CartStateModel>) {
    window.localStorage.setItem('cart-products', JSON.stringify(ctx.getState().products));
  }

  @Action(CartActions.ClearCart)
  clearCart(ctx: StateContext<CartStateModel>) {
    ctx.patchState({
      products: []
    });
    ctx.dispatch(new CartActions.StoreInLocalStorage());
  }

  @Action(CartActions.SetPaymentMethod)
  setPaymentMethod(ctx: StateContext<CartStateModel>, action: CartActions.SetPaymentMethod) {
    ctx.patchState({
      paymentProvider: action.payment_provider
    });
  }

  @Action(CartActions.SetCheckoutNote)
  setCheckoutNote(ctx: StateContext<CartStateModel>, action: CartActions.SetCheckoutNote) {
    ctx.patchState({
      checkoutNote: action.note
    });
  }

}
