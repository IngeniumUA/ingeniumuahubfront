import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, of} from "rxjs";
import {CheckoutI} from "../../../../shared/components/items/interactions/checkout";
import {StaffCheckoutService} from "../../../../core/services/staff/staff-checkout.service";
import {StaffCheckoutI} from "../../../../shared/models/staff/staff_checkout";

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.css']
})
export class CheckoutDetailComponent implements OnInit {

  checkout_id: string | null = null;
  checkoutDetail$: Observable<StaffCheckoutI> = of();

  constructor(private route: ActivatedRoute,
              private checkoutService: StaffCheckoutService) {
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

    this.checkoutDetail$ = this.checkoutService.getCheckout(this.checkout_id)
  }

}
