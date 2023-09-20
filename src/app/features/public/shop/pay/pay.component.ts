import {Component, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {CheckoutIdI, PaymentService} from "../../../../core/services/shop/payment/payment.service";

import {StripeCardNumberComponent, StripePaymentElementComponent, StripeService} from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private stripeService: StripeService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: any,
  ) {
  }

  checkoutId!: CheckoutIdI;

  ngOnInit() {
    this.paymentService.getCheckoutID().subscribe((value) => {
      this.checkoutId = value;

      if (this.checkoutId.payment_providor === 'stripe') {
        this.setupStripe()
      } else if (this.checkoutId.payment_providor === 'sumup') {
        this.loadSumupSource();
      }
    })
  }

  /* STRIPE */
  setupStripe() {
    this.elementsOptions.clientSecret = this.checkoutId.checkout_id
  }
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  paying: boolean = false
  paymentElementForm = this.formBuilder.group({});

  stripePay() {
    if (this.paymentElementForm.valid) {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: 'https://ingeniumua.be/account'
        }
      }).subscribe((result) => {
        this.paying = false;
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
    } else {
      console.log(this.paymentElementForm);
    }
  }
  /* Stripe finish */


























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
