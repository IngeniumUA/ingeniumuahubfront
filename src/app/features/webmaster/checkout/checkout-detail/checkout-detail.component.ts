import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, of} from "rxjs";
import {StaffCheckoutService} from "../../../../core/services/staff/staff-checkout.service";
import {StaffCheckoutI} from "../../../../shared/models/staff/staff_checkout";
import {StaffTransactionI} from "../../../../shared/models/staff/staff_transaction";
import {StaffTransactionService} from "../../../../core/services/staff/staff-transaction.service";

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.css']
})
export class CheckoutDetailComponent implements OnInit {

  checkout_id!: string;
  checkoutDetail$: Observable<StaffCheckoutI> = of();
  transactions$: Observable<StaffTransactionI[]> = of()
  loading: boolean = false;
  formError: null | string = null

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
      return
    }
    this.checkout_id = id;

    this.FetchData()
  }


  public FetchData() {
    this.checkoutDetail$ = this.checkoutService.getCheckout(this.checkout_id);
    this.transactions$ = this.staffTransactionService.getTransactions(0, 100, null, null, this.checkout_id)
  }

  public Patch() {

  }

  public Refund() {

  }

  public SendEmail() {

  }
}
