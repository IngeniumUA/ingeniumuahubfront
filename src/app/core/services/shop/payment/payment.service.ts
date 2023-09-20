import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CartService} from "../cart/cart.service";
import {Observable, of} from "rxjs";
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
    const products = []
    return of({checkout_id:'pi_3NsBZYBSXssFMR3b2Cn7rhc1_secret_iLgROlVAsYtMNpcHJYvBiCvDm', payment_providor:'stripe'})
    // return this.httpClient.post<CheckoutIdI>(apiEnviroment.apiUrl + "payment/checkout", {})
  }
}
