import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';
import {Store} from "@ngxs/store";
import {CartActions, CartState} from "@ingenium/app/core/store";
import {PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";
import {map} from "rxjs/operators";
import {catchError} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {CartSuccessI} from "@ingenium/app/shared/models/cart/cartModels";
import {CheckoutSmollI} from "@ingenium/app/shared/models/checkout/checkoutModels";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-page',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  checkout!: CheckoutSmollI;
  loading = true;
  stripePayment = false;

  constructor(private store: Store,
              private httpClient: HttpClient,
              private toastrService: ToastrService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    // Redirect if our cart is empty
    if (this.store.selectSnapshot(CartState.getProducts).length === 0) {
      this.gotoPage('sub/shop')
    }

    const paymentProvider = this.store.selectSnapshot(CartState.getPaymentProvider);

    // Request the checkout ID.
    this.httpClient.post<CartSuccessI>(`${apiEnviroment.apiUrl}cart/checkout?requested_payment_provider=${paymentProvider.valueOf()}`, {
      products: this.store.selectSnapshot(CartState.getProducts),
      checkout_note: this.store.selectSnapshot(CartState.getCheckoutNote),
    }).pipe(
      map((result: CartSuccessI) => this.processCheckoutResponse(result)),
      catchError((_): any => {
        // // todo this.store.clearPaymentErrors();
        // if (err instanceof HttpErrorResponse) {
        //  const cartFailed: CartFailedI = err.error["detail"];
        //  // todo this.store.setPaymentErrors(-
        // }
        this.gotoPage('sub/shop/checkout');
      })
    ).subscribe();

    // Clear the cart
    this.store.dispatch(new CartActions.ClearCart());
    this.store.dispatch(new CartActions.SetCheckoutNote(''));
  }

  processCheckoutResponse(response: CartSuccessI) {
    switch (response.checkout.payment_provider) {
      case PaymentProviderEnum.Dev:
        // TODO: change this so it isn't hardcoded
        if (Number.isInteger(response.tracker_id)) {
          this.toastrService.success(`Het volgnummer is ${response.tracker_id}`, 'Bestelling gelukt!', {
            timeOut: 10000,
          });
          this.gotoPage('/account/transactions/')
          break;
        }
        this.gotoPage('sub/account/transactions')
        break;

      case PaymentProviderEnum.Free:
        this.gotoPage('sub/shop/confirm')
        break;

      case PaymentProviderEnum.Kassa:
        // TODO: change this so it isn't hardcoded
        if (Number.isInteger(response.tracker_id)) {
          this.toastrService.success(`Het volgnummer is ${response.tracker_id}`, 'Bestelling gelukt!', {
            timeOut: 10000,
          });
          this.gotoPage('sub/popupz/menu/')
          break;
        }

        this.toastrService.success('De bestelling is gelukt, zorg dat de betaling aan de kassa wordt voldaan!');
        this.gotoPage('sub/shop/confirm')
        break;

      case PaymentProviderEnum.Stripe:
        this.stripePayment = true;
        break;
    }

    this.checkout = response.checkout;
    this.loading = false;
    return response;
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
