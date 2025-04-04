import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {CartActions, CartState, UserState} from "@ingenium/app/core/store";
import {PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {map} from "rxjs/operators";
import {catchError} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {CartFailedI, CartSuccessI} from "@ingenium/app/shared/models/cart/cartI";
import {CheckoutSmollI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";

@Component({
  selector: 'app-page',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  checkout!: CheckoutSmollI;
  loading = true;
  stripePayment = false;

  constructor(private store: Store, private httpClient: HttpClient, private router: Router,
              private toastrService: ToastrService) {}

  ngOnInit() {
    // Redirect if our cart is empty
    if (this.store.selectSnapshot(CartState.getProducts).length === 0) {
      this.router.navigateByUrl('/shop');
    }

    // Get the email, if user is authenticated set it to none
    let email = this.store.selectSnapshot(CartState.getGuestEmail);
    if (this.store.selectSnapshot(UserState.isAuthenticated)) {
      email = null;
    }

    const paymentProvider = this.store.selectSnapshot(CartState.getPaymentProvider);

    // Request the checkout ID.
    this.httpClient.post<CartSuccessI>(`${apiEnviroment.apiUrl}cart/checkout?requested_payment_provider=${paymentProvider.valueOf()}`, {
      cart: {
        products: this.store.selectSnapshot(CartState.getProducts),
        checkout_note: this.store.selectSnapshot(CartState.getCheckoutNote),
        user_email: email,
      },
      captcha_token: this.store.selectSnapshot(CartState.getCaptchaToken),
    }).pipe(
      map((result: CartSuccessI) => this.processCheckoutResponse(result)),
      catchError((error): any => {
        if (error instanceof HttpErrorResponse && error.status === 406) {
          this.store.dispatch(new CartActions.AddCartErrors(error.error.detail as CartFailedI));
          this.toastrService.error('Er is iets misgegaan met de bestelling, controleer de producten en probeer het opnieuw.');
        }

        this.router.navigateByUrl('/shop/checkout');
      })
    ).subscribe();
  }

  navigateToNextPage() {
    if (this.store.selectSnapshot(UserState.isAuthenticated)) {
      this.router.navigateByUrl('/account/transactions')
    } else {
      this.router.navigateByUrl('/shop/confirm')
    }
  }

  processCheckoutResponse(response: CartSuccessI) {
    switch (response.checkout.payment_provider) {
      case PaymentProviderEnum.Dev:
        // TODO: change this so it isn't hardcoded
        if (Number.isInteger(response.tracker_id)) {
          this.toastrService.success(`Het volgnummer is ${response.tracker_id}`, 'Bestelling gelukt!', {
            timeOut: 10000,
          });
          this.navigateToNextPage()
          break;
        }

        this.navigateToNextPage()
        break;

      case PaymentProviderEnum.Free:
        this.navigateToNextPage()
        break;

      case PaymentProviderEnum.Kassa:
        // TODO: change this so it isn't hardcoded
        if (Number.isInteger(response.tracker_id)) {
          this.toastrService.success(`Het volgnummer is ${response.tracker_id}`, 'Bestelling gelukt!', {
            timeOut: 10000,
          });
          this.router.navigateByUrl('/popupz/menu/');
          break;
        }

        this.toastrService.success('De bestelling is gelukt, zorg dat de betaling aan de kassa wordt voldaan!');
        this.router.navigateByUrl('/shop/confirm');
        break;

      case PaymentProviderEnum.Stripe:
        this.stripePayment = true;
        break;
    }

    // Clear the cart
    this.store.dispatch(new CartActions.ClearCart());
    this.store.dispatch(new CartActions.SetCheckoutNote(''));
    this.store.dispatch(new CartActions.AddCartErrors(null));

    this.checkout = response.checkout;
    this.loading = false;
    return response;
  }
}
