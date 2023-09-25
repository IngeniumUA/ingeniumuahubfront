import {Component, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CheckoutIdI, PaymentService} from "../../../../core/services/shop/payment/payment.service";

import {StripeCardNumberComponent, StripePaymentElementComponent, StripeService} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import {FormBuilder} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: any,
  ) {
  }

  checkoutId!: CheckoutIdI;
  stripePayment: boolean = false
  devPayment: boolean = false

  ngOnInit() {
    this.paymentService.getCheckoutID().subscribe((value) => {
      this.checkoutId = value;

      if (this.checkoutId.payment_providor === 'dev') {
        this.setupDev()
      }
      else if (this.checkoutId.payment_providor === 'stripe') {
        this.stripePayment = true
      } else if (this.checkoutId.payment_providor === 'sumup') {
        this.loadSumupSource();
      }
    })
  }

  /* DEV */
  setupDev() {
    this.devPayment = true;

  }

  doDevPayment() {
    this.httpClient.get(apiEnviroment.apiUrl + "webhook/payment/dev/" + this.checkoutId.checkout_id).subscribe()
    this.router.navigateByUrl('/account/transactions')
    return
  }









  /* SUMUP */
  loadSumupSource() {
    const scriptElement = this.renderer2.createElement('script');
    scriptElement.onload = this.mountSumupCard.bind(this);
    scriptElement.type = 'text/javascript';
    scriptElement.src = 'https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js'; // Defines someGlobalObject
    scriptElement.text = ``;
    this.renderer2.appendChild(this._document.body, scriptElement);
  }

  mountSumupCard() {
    const s = this.renderer2.createElement('script');
    s.text = `
    SumUpCard.mount({
    id: 'sumup-card',
    checkoutId: '` +
      this.checkoutId.checkout_id.toString()
      +
      `',
    onResponse: function (type, body) {
      console.log('Type', type);
      console.log('Body', body);
    },
    showFooter: false,
    onPaymentMethodsLoad: function () { return ['paypal', 'bancontact']; }
  });
    `
    this.renderer2.appendChild(this._document.body, s);
  }
}
