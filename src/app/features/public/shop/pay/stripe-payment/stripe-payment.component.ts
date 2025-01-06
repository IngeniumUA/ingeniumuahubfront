import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PaymentIntentOrSetupIntentResult, PaymentIntentResult, StripeElementsOptions} from "@stripe/stripe-js";
import {StripePaymentElementComponent, StripeService} from "ngx-stripe";
import {FormBuilder} from "@angular/forms";
import {CheckoutSmollI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {

  constructor(    private formBuilder: FormBuilder,
                  private stripeService: StripeService,
                  private navCtrl: NavController,
                  private pageTrackService: PageTrackingService,) {
    backButtonClicked()
  }

  @Input() checkout!: CheckoutSmollI;

  ngOnInit() {
    this.elementsOptions.clientSecret = this.checkout.client_secret
  }

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  @ViewChild(StripePaymentElementComponent)
  paymentElement!: StripePaymentElementComponent;
  paying: boolean = false
  paymentElementForm = this.formBuilder.group({});

  stripePay() {
    if (this.paying) {
      alert("Je bent al aan het betalen!");
      return
    }

    if (!this.paymentElementForm.valid) {
      alert("Er is iets fout gegaan, probeer het opnieuw!")
      throw new Error(this.paymentElementForm.errors?.toString());
    }

    this.paying = true;
    this.stripeService.confirmPayment({
      elements: this.paymentElement.elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: 'https://ingeniumua.be/shop/confirm'
      }
    }).subscribe((result) => {
      this.paying = false;
      this.handleStripeResponse(result);
    });
  }

  handleStripeResponse(result: PaymentIntentResult | PaymentIntentOrSetupIntentResult) {
      if (result.error || result.paymentIntent === undefined) {
          // Show error to your customer (e.g., insufficient funds)
          alert( result.error!.message );
          return;
      }

      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          alert( 'Betaling Success!' );

          // Redirect to transactions
          this.pageTrackService.addToTree('sub/account/transactions')
          this.navCtrl.navigateRoot('/sub/account/transactions').then()
      } else if (result.paymentIntent.status === 'requires_action') {
          // Big one!
          // We sent about 35 mails over 5 months to get this issue fixed
          // It's a specific Bancontact authentication problem where a bank requires extra authentication
          // https://docs.stripe.com/js/payment_intents/handle_next_action
          this.paying = true;
          if (result.paymentIntent.client_secret == null) {
            alert("Client Secret was invalid!");
            return;
          }
          this.stripeService.handleNextAction({clientSecret: result.paymentIntent.client_secret}
          ).subscribe((result) => {
            this.handleStripeResponse(result);
            this.paying = false;
          });
      } else {
          // If no status was not handled in previous cases we display error
          alert('Er is iets foutgegaan!');
      }
  }

}
