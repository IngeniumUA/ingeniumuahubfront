import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {catchError, interval, Subscription, take} from "rxjs";
import {HubCheckoutTrackerStatusEnum} from "@ingenium/app/shared/models/tracker";
import {apiEnviroment} from "@ingenium/environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

interface PublicOrderTrackerI {
  id: number;
  checkout_tracker_status: HubCheckoutTrackerStatusEnum,
}
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-popupz-public-tracker',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf
  ],
  providers: [
    { provide: Window, useValue: window }
  ],
  templateUrl: './popupz-public-tracker.component.html',
})
export class PopupzPublicTrackerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inprogress') inProgress: ElementRef = null!;
  @ViewChild('completed') completed: ElementRef = null!;

  previousTimestamp: DOMHighResTimeStamp = 0;
  movingDirection: number[] = [0, 0]; // -1 = up, 0 = available, 1 = down, 2 = WAIT
  interval!: Subscription;
  inProgressOrders: PublicOrderTrackerI[] = [];
  doneOrders: PublicOrderTrackerI[] = [];

  constructor(@Inject(Window) private readonly window: Window,
              private httpClient: HttpClient,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngAfterViewInit() {
    this.getOrders();
    this.interval = interval(5000)
      .pipe()
      .subscribe(() => {
        this.getOrders();
      });

    this.scrollLists(0);
  }

  ngOnDestroy() {
    this.interval.unsubscribe();
  }

  getOrders() {
    this.httpClient.get<PublicOrderTrackerI[]>(`${apiEnviroment.apiUrl}order_tracking`)
      .pipe(
        take(1),
        map((data: PublicOrderTrackerI[]) => {
          this.inProgressOrders = data.filter((order) => {
            return order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Pending;
          });
          this.doneOrders = data.filter((order) => {
            return order.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Ready;
          });
        }),
        catchError((error) => {
          return error;
        })
      )
      .subscribe()
  }

  scrollLists(timestamp: DOMHighResTimeStamp) {
    const delta = timestamp - this.previousTimestamp;
    this.checkForOverflowingContent(this.inProgress, 0, delta);
    this.checkForOverflowingContent(this.completed, 1, delta);
    this.previousTimestamp = timestamp;

    this.window.requestAnimationFrame((time) => {
      this.scrollLists(time);
    });
  }

  checkForOverflowingContent(ref: ElementRef, index: number, delta: number) {
    const element = ref.nativeElement;

    // If we are in waiting mode or there is no overflow, do nothing
    if (this.movingDirection[index] === 2 || element.scrollHeight <= element.clientHeight) {
      return;
    }

    // Are we at the top of the list? If so, move slowly to the bottom
    if (element.scrollTop === 0 && this.movingDirection[index] === 0) {
      this.movingDirection[index] = 1; // Move down
    } else if (element.scrollTop === element.scrollHeight - element.clientHeight && this.movingDirection[index] === 0) {
      this.movingDirection[index] = -1; // Move up
    }

    // Calculate the new scroll position
    const amountToScroll = element.scrollHeight - element.clientHeight;
    let amountLeftToScroll = element.scrollTop;
    if (this.movingDirection[index] === 1) {
      amountLeftToScroll = amountToScroll - element.scrollTop;
    }

    // Calculate the delta
    const scrollDelta = this.getEasingDelta(amountLeftToScroll / amountToScroll);
    element.scrollTop += Math.ceil(scrollDelta) * delta * this.movingDirection[index] * 0.1; // 0.1 is the speed

    if (amountLeftToScroll === 0) {
      this.movingDirection[index] = 2;
      setTimeout(() => {
        this.movingDirection[index] = 0;
      }, 5000);
    }
  }

  getEasingDelta(x: number) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }
}
