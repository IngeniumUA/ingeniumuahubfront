import {Action,createSelector, NgxsOnInit, Selector, State, StateContext} from "@ngxs/store";
import {CartActions, CartStateModel} from "@ingenium/app/core/store";
import {Injectable} from "@angular/core";
import {ProductOutI, PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {removeItem} from "@ngxs/store/operators";

// @ts-expect-error
import structuredClone from '@ungap/structured-clone';
import {CartFailedI} from "@ingenium/app/shared/models/cart/cartI";

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    products: [],
    paymentProvider: PaymentProviderEnum.Stripe,
    checkoutNote: '',
    failedCart: null,
    user_email: null,
    captchaToken: null,
  },
})
@Injectable()
export class CartState implements NgxsOnInit {
  constructor() {}

  ngxsOnInit(ctx: StateContext<CartStateModel>): void {
    const localStorageState = window.localStorage.getItem('cart-state');
    if (localStorageState) {
      ctx.patchState({
        ...JSON.parse(localStorageState),
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
  static getProducts(state: CartStateModel): ProductOutI[] {
    return state.products;
  }

  @Selector()
  static getProductCount(state: CartStateModel): number {
    return state.products.length;
  }

  @Selector()
  static getFailedCart(state: CartStateModel): CartFailedI|null {
    return state.failedCart;
  }

  @Selector()
  static getGuestEmail(state: CartStateModel): string|null {
    return state.user_email;
  }

  @Selector()
  static getCaptchaToken(state: CartStateModel): string|null {
    return state.captchaToken;
  }


  /**
   * Get the quantity of the product in the cart.
   * @param product the product you which to check
   * @param checkPricePolicy true if you should match on price policy too. Default = false
   */
  static getProductQuantity(product: ProductOutI, checkPricePolicy: boolean = false) {
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
    const productsToAdd: ProductOutI[] = [];
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
      products: removeItem<ProductOutI>(action.itemIndex)(ctx.getState().products)
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
    const state = structuredClone(ctx.getState());
    state.captchaToken = null;
    window.localStorage.setItem('cart-state', JSON.stringify(state));
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
    ctx.dispatch(new CartActions.StoreInLocalStorage());
  }

  @Action(CartActions.SetEmail)
  setEmail(ctx: StateContext<CartStateModel>, action: CartActions.SetEmail) {
    ctx.patchState({
      user_email: action.email,
    });
    ctx.dispatch(new CartActions.StoreInLocalStorage());
  }

  @Action(CartActions.SetCaptchaToken)
  setCaptchaToken(ctx: StateContext<CartStateModel>, action: CartActions.SetCaptchaToken) {
    ctx.patchState({
      captchaToken: action.token,
    });
  }

  @Action(CartActions.AddCartErrors)
  addCartErrors(ctx: StateContext<CartStateModel>, action: CartActions.AddCartErrors) {
    ctx.patchState({
      failedCart: action.errors
    });
  }

}
