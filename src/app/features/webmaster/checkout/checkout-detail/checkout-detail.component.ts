import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {CheckoutI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";
import {TransactionI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {CheckoutService} from "@ingenium/app/core/services/coreAPI/payment/checkout.service";
import {TransactionService} from "@ingenium/app/core/services/coreAPI/payment/transaction.service";
import {PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {ToastrService} from "ngx-toastr";
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.css']
})
export class CheckoutDetailComponent implements OnInit {

  checkout_id!: string;
  checkoutDetail$: Observable<CheckoutI> = of();
  transactions$: Observable<TransactionI[]> = of();
  loading: boolean = false;
  formError: null | string = null;
  successMessage: null | string = null;
  transactionPatched: boolean = false;

  constructor(private route: ActivatedRoute,
              private checkoutService: CheckoutService,
              private staffTransactionService: TransactionService,
              private toastrService: ToastrService,) {
    backButtonClicked()
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return;
    }
    this.checkout_id = id;

    this.LoadData();
  }


  public LoadData(patchedTransaction: boolean = false) {
    this.loading = true;
    this.checkoutDetail$ = this.checkoutService.getCheckout(this.checkout_id);
    this.transactions$ = this.staffTransactionService.queryTransactions(
      0, 100, null, null, null,
      null, null, this.checkout_id, null, null, null, null);
    this.loading = false;

    if (patchedTransaction) {
      this.transactionPatched = true;
    }
  }

  public Patch() {
    this.loading = true;
    this.toastrService.error('Not Implemented');
    this.loading = false;
  }

  public Refund() {
    this.successMessage = null;
    this.formError = null;

    this.loading = true;
    const forceRefund = true; // TODO Place this param in a form
    this.checkoutService.refundCheckout(this.checkout_id, forceRefund).subscribe(
      (_checkout) => {
        this.LoadData();
        this.toastrService.success('Refund Started');
      },
      (error: Error) => {
        this.handleError(error);
      });
    this.loading = false;
  }

  public SendEmail() {
    this.successMessage = null;
    this.formError = null;

    this.loading = true;
    this.checkoutService.emailCheckout(this.checkout_id).subscribe(
      (succes) => {
        if (succes) {
          this.toastrService.success('Email sent!');
        } else {
          this.toastrService.error('Email not sent :§');
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
    this.loading = false;
  }

  public handleError(error: Error) {
    this.successMessage = null;
    if (error instanceof HttpErrorResponse) {
      this.formError = error.message;
    }
  }

  protected readonly String = String;
  protected readonly PaymentProviderEnum = PaymentProviderEnum;
  protected readonly PaymentStatusEnum = PaymentStatusEnum;
}
