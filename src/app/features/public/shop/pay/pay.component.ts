import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {apiEnviroment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {CheckoutIdI, PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";
import {catchError} from "rxjs";

@Component({
  selector: 'app-page',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  checkoutId!: CheckoutIdI;
  loading = true;
  stripePayment = false;
  devPayment = false;

  constructor(private store: Store, private httpClient: HttpClient, private router: Router) {}

  ngOnInit() {
    // Redirect if our cart is empty
    if (this.store.selectSnapshot(CartState.getProducts).length === 0) {
      this.router.navigateByUrl('/shop');
    }

    const paymentProvider = this.store.selectSnapshot(CartState.getPaymentProvider);

    return;

    // Request the checkout ID.
    this.httpClient.post<CheckoutIdI>(`cart/checkout?requested_payment_provider=${paymentProvider.valueOf()}`, {
      products: this.store.selectSnapshot(CartState.getProducts)
    }).pipe(
      map((result: CheckoutIdI) => {
        this.checkoutId = result;

        switch (result.payment_provider) {
          case PaymentProviderEnum.Dev:
            this.setupDev();
            break;

          case PaymentProviderEnum.Free:
            this.router.navigateByUrl('/shop/confirm');
            break;

          case PaymentProviderEnum.Kassa:
            this.router.navigateByUrl('/shop/confirm');
            break;

          case PaymentProviderEnum.Stripe:
            this.stripePayment = true;
            break;
        }

        this.loading = false;
        return result;
      }),
      catchError((_): any => {
        /*this.cartService.clearPaymentErrors();
        if (error instanceof HttpErrorResponse) {
          this.cartService.insertPaymentError(error);
        }*/
        this.router.navigateByUrl('/shop/checkout');
      })
    ).subscribe();

    /*this.paymentService.getCheckoutID().pipe(first()).subscribe({
      next: (value) => {
        this.checkoutId = value;

        if (this.checkoutId.payment_providor === 'dev') {
          this.setupDev();
        } else if (this.checkoutId.payment_providor === 'kassa') {
          this.router.navigateByUrl('/shop/confirm');
        } else if (this.checkoutId.payment_providor === 'free') {
          this.router.navigateByUrl('/shop/confirm');
        } else if (this.checkoutId.payment_providor === 'stripe') {
          this.stripePayment = true;
        } else if (this.checkoutId.payment_providor === 'sumup') {
          this.loadSumupSource();
        }
      },
      error: error => {
        this.cartService.clearPaymentErrors();
        if (error instanceof HttpErrorResponse) {
          this.cartService.insertPaymentError(error);
        }
        this.router.navigateByUrl('/shop/checkout');
      }}
    );*/
  }

  setupDev() {
    this.devPayment = true;
  }

  doDevPayment() {
    this.httpClient.get(apiEnviroment.apiUrl + 'webhook/payment/dev/' + this.checkoutId.checkout_id).subscribe();
    this.router.navigateByUrl('/account/transactions');
    return;
  }
}
