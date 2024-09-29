import {Action, NgxsOnInit, Selector, State, StateContext} from "@ngxs/store";
import {CartActions, CartStateModel} from "@ingenium/app/core/store";
import {Injectable} from "@angular/core";
import {IProductItem} from "@ingenium/app/shared/models/items/products/products";
import {HttpClient} from "@angular/common/http";
import {removeItem} from "@ngxs/store/operators";

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    products: [],
  },
})
@Injectable()
export class CartState implements NgxsOnInit {
  constructor(private httpClient: HttpClient) {}

  ngxsOnInit(ctx: StateContext<CartStateModel>): void {
    const localStorageState = window.localStorage.getItem('cart-products');
    if (localStorageState) {
      ctx.patchState({
        products: JSON.parse(localStorageState),
      })
    }
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

  // =======================================

  @Action(CartActions.FetchCart)
  fetchCart(_ctx: StateContext<CartStateModel>) {

  }

  @Action(CartActions.AddToCart)
  addToCart(ctx: StateContext<CartStateModel>, action: CartActions.AddToCart) {
    // Create a copy of the product
    const product = structuredClone(action.product);

    ctx.patchState({
      products: [
        ...ctx.getState().products,
        product
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

  @Action(CartActions.StoreInLocalStorage)
  storeInLocalStorage(ctx: StateContext<CartStateModel>) {
    window.localStorage.setItem('cart-products', JSON.stringify(ctx.getState().products));
  }

  @Action(CartActions.Checkout)
  checkout(ctx: StateContext<CartStateModel>) {
    return this.httpClient.post('/api/checkout', ctx.getState().products);
  }
}
