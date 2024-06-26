import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CartService} from '../cart/cart.service';
import {Observable, tap} from 'rxjs';
import {apiEnviroment} from '../../../../../environments/environment';

export interface CheckoutIdI {
  checkout_id: string
  payment_providor: string
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient,
              private cartService: CartService) { }

  public getCheckoutID(): Observable<CheckoutIdI> {
    const cart_transactions = this.cartService.getCurrentTransactions();
    const api_transactions = cart_transactions.map((value) => {
      return {product: value.product, count: value.count};
    });

    const checkout_in = {
      cart: api_transactions,
      description: null  // TODO description can be added to checkout create code
    }

    // Post transaction to API
    return this.httpClient.post<CheckoutIdI>(apiEnviroment.apiUrl + 'interact/checkout', checkout_in).pipe(
      tap(() => this.cartService.clear())
    );
  }
}
