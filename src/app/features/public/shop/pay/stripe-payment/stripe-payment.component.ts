import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StripeElementsOptions} from "@stripe/stripe-js";
import {StripePaymentElementComponent, StripeService} from "ngx-stripe";
import {CheckoutIdI, PaymentService} from "../../../../../core/services/shop/payment/payment.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {

  constructor(    private formBuilder: FormBuilder,
                  private paymentService: PaymentService,
                  private stripeService: StripeService,) {
  }

  @Input() checkoutId!: CheckoutIdI;

  ngOnInit() {
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

}
