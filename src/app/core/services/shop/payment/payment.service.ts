import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CartService} from "../cart/cart.service";
import {Observable, of, tap} from "rxjs";
import {apiEnviroment} from "../../../../../enviroments";

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
    const cart_transactions = this.cartService.getCurrentTransactions()
    const api_transactions = cart_transactions.map((value) => {
      return {product: value.product, count: value.count}
    })

    // return of({checkout_id:'pi_3NsBZYBSXssFMR3b2Cn7rhc1_secret_iLgROlVAsYtMNpcHJYvBiCvDm', payment_providor:'dev'})
    return this.httpClient.post<CheckoutIdI>(apiEnviroment.apiUrl + "interact/checkout", api_transactions).pipe(
      tap(_ => this.cartService.clear())
    )
  }
}
