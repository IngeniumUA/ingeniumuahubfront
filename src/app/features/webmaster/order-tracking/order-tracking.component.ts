import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {retry, Subscription, switchMap, timer} from 'rxjs';
import {HubCheckoutTrackerI} from '@ingenium/app/shared/models/tracker';
import {CheckoutTrackerService} from "@ingenium/app/core/services/coreAPI/checkoutTracker.service";

@Component({
    selector: 'app-page',
    templateUrl: './order-tracking.component.html',
    standalone: false
})
export class OrderTrackingComponent implements OnInit, OnDestroy {

  itemUUID = this.route.snapshot.paramMap.get('id');
  intervalSubscription: Subscription = new Subscription();
  defaultFilter: number|null = null;

  items: HubCheckoutTrackerI[] = [];

  constructor(private route: ActivatedRoute, private trackingService: CheckoutTrackerService) {}

  ngOnInit() {
    this.intervalSubscription = timer(0, 1000)
      .pipe(
        switchMap(() => this.trackingService.getTrackers(0, 50, this.itemUUID, this.defaultFilter)),
        retry()
      )
      .subscribe((data) => this.items = data);
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }

  nextStatus(item: HubCheckoutTrackerI) {
    this.trackingService.nextStatus(item.checkout.id).subscribe((data) => {
      item = data;
    });
  }

  changeFilter(filter: string) {
    if (filter === 'all') {
      this.defaultFilter = null;
    } else {
      this.defaultFilter = parseInt(filter, 10);
    }
  }

  getCheckoutId(_index: number, item: HubCheckoutTrackerI) {
    return item.checkout.id;
  }
}
