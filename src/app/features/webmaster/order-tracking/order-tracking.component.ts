import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {retry, Subscription, switchMap, timer} from 'rxjs';
import {StaffTrackerService} from '@ingenium/app/core/services/staff/staff-tracker.service';
import {HubCheckoutTrackerI} from '@ingenium/app/shared/models/tracker';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-page',
  templateUrl: './order-tracking.component.html',
})
export class OrderTrackingComponent implements OnInit, OnDestroy {

  itemUUID = this.route.snapshot.paramMap.get('id');
  intervalSubscription: Subscription = new Subscription();
  defaultFilter: number|null = null;

  items: HubCheckoutTrackerI[] = [];

  constructor(private route: ActivatedRoute,
              private trackingService: StaffTrackerService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

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
