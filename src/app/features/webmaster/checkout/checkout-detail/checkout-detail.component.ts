import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, of} from 'rxjs';
import {StaffCheckoutService} from '../../../../core/services/staff/staff-checkout.service';
import {StaffCheckoutI} from '../../../../shared/models/staff/staff_checkout';
import {StaffTransactionI} from '../../../../shared/models/staff/staff_transaction';
import {StaffTransactionService} from '../../../../core/services/staff/staff-transaction.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.css']
})
export class CheckoutDetailComponent implements OnInit {

  checkout_id!: string;
  checkoutDetail$: Observable<StaffCheckoutI> = of();
  transactions$: Observable<StaffTransactionI[]> = of();
  loading: boolean = false;
  formError: null | string = null;
  successMessage: null | string = null;
  transactionPatched: boolean = false;

  constructor(private route: ActivatedRoute,
              private checkoutService: StaffCheckoutService,
              private staffTransactionService: StaffTransactionService) {
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

    this.FetchData();
  }


  public FetchData(patchedTransaction: boolean = false) {
    this.loading = true;
    this.checkoutDetail$ = this.checkoutService.getCheckout(this.checkout_id);
    this.transactions$ = this.staffTransactionService.getTransactions(0, 100, null, null, this.checkout_id);
    this.loading = false;

    if (patchedTransaction) {
      this.transactionPatched = true;
    }
  }

  public Patch() {
    this.loading = true;
    this.formError = 'Not Implemented';
    this.loading = false;
  }

  public Refund() {
    this.successMessage = null;
    this.formError = null;

    this.loading = true;
    const forceRefund = true; // TODO Place this param in a form
    this.checkoutService.refundCheckout(this.checkout_id, forceRefund).subscribe(
      (checkout) => {
        this.FetchData();
        this.successMessage = 'Refund started!';
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
          this.successMessage = 'Email sent!';
        } else {
          this.formError = 'Email not sent :§';
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
}
