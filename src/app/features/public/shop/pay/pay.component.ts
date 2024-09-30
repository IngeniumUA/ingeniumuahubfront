import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {CartActions, CartState} from "@ingenium/app/core/store";
import {CheckoutIdI, CheckoutResponseI, PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";
import {map} from "rxjs/operators";
import {catchError} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-page',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  checkoutId!: CheckoutIdI;
  loading = true;
  stripePayment = false;

  constructor(private store: Store, private httpClient: HttpClient, private router: Router,
              private toastrService: ToastrService) {}

  ngOnInit() {
    // Redirect if our cart is empty
    if (this.store.selectSnapshot(CartState.getProducts).length === 0) {
      this.router.navigateByUrl('/shop');
    }

    const paymentProvider = this.store.selectSnapshot(CartState.getPaymentProvider);

    // Request the checkout ID.
    this.httpClient.post<CheckoutResponseI>(`${apiEnviroment.apiUrl}cart/checkout?requested_payment_provider=${paymentProvider.valueOf()}`, {
      products: this.store.selectSnapshot(CartState.getProducts)
    }).pipe(
      map((result: CheckoutResponseI) => this.processCheckoutResponse(result.checkout)),
      catchError((_): any => {
        //this.cartService.clearPaymentErrors();
        //if (error instanceof HttpErrorResponse) {
        //  this.cartService.insertPaymentError(error);
        //}
        this.router.navigateByUrl('/shop/checkout');
      })
    ).subscribe();

    // Clear the cart
    this.store.dispatch(new CartActions.ClearCart());
  }

  processCheckoutResponse(checkout: CheckoutIdI) {
    switch (checkout.payment_provider) {
      case PaymentProviderEnum.Dev:
        this.toastrService.success('Development payment successful');
        this.router.navigateByUrl('/account/transactions');
        break;

      case PaymentProviderEnum.Free:
        this.router.navigateByUrl('/shop/confirm');
        break;

      case PaymentProviderEnum.Kassa:
        this.toastrService.success('De bestelling is gelukt, zorg dat de betaling aan de kassa wordt voldaan!');
        this.router.navigateByUrl('/shop/confirm');
        break;

      case PaymentProviderEnum.Stripe:
        this.stripePayment = true;
        break;
    }

    this.checkoutId = checkout;
    this.loading = false;
    return checkout;
  }
}
