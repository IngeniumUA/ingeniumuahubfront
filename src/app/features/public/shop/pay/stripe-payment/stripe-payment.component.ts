import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {StripeElementsOptions} from '@stripe/stripe-js';
import {StripePaymentElementComponent, StripeService} from 'ngx-stripe';
import {CheckoutIdI, PaymentService} from '../../../../../core/services/shop/payment/payment.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {

  constructor(    private formBuilder: FormBuilder,
                  private paymentService: PaymentService,
                  private stripeService: StripeService,
                  private router: Router) {
  }

  @Input() checkoutId!: CheckoutIdI;

  ngOnInit() {
    this.elementsOptions.clientSecret = this.checkoutId.checkout_id;

  }

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  @ViewChild(StripePaymentElementComponent)
    paymentElement!: StripePaymentElementComponent;
  paying: boolean = false;
  paymentElementForm = this.formBuilder.group({});

  stripePay() {
    if (this.paymentElementForm.valid) {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: 'https://ingeniumua.be/shop/confirm'
        }
      }).subscribe((result) => {
        this.paying = false;
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert( result.error.message );
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert( 'Betaling Success!' );

            // Redirect to transactions
            this.router.navigateByUrl('/account/transactions');
          }
        }
      });
    } else {
      console.log(this.paymentElementForm);
    }
  }

}
