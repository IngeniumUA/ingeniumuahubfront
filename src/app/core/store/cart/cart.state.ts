import {State} from "@ngxs/store";
import {CartStateModel} from "@ingenium/app/core/store";
import {Injectable} from "@angular/core";

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    products: [],
  },
})
@Injectable()
export class CartState {
  constructor() {}
}
