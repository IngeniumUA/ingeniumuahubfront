import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, interval, Subscription, take} from "rxjs";
import {HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum} from "@ingenium/app/shared/models/tracker";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {map} from "rxjs/operators";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {TransactionI} from "@ingenium/app/core/services/user/account/account.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-popupz-staff-display',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    KeyValuePipe,
    FormsModule
  ],
  templateUrl: './popupz-staff-display.component.html',
  styleUrl: './popupz-staff-display.component.scss'
})
export class PopupzStaffDisplayComponent implements OnInit, OnDestroy {
  interval!: Subscription
  filter: HubCheckoutTrackerStatusEnum = HubCheckoutTrackerStatusEnum.All;
  filterDrinks: boolean = false;
  orders: HubCheckoutTrackerI[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getOrders();

    // Setup interval
    this.interval = interval(5000)
      .pipe()
      .subscribe(() => {
        this.getOrders();
      });
  }

  ngOnDestroy() {
    this.interval.unsubscribe();
  }

  getOrders() {
    this.httpClient.get<HubCheckoutTrackerI[]>(`${apiEnviroment.apiUrl}checkout/tracker`)
      .pipe(
        take(1),
        map((data: HubCheckoutTrackerI[]) => {
          this.orders = data.filter((order) => {
            // Filter orders based on status
            return this.filter === HubCheckoutTrackerStatusEnum.All || order.checkout_tracker_status === this.filter;
          });
          return data;
        }),
        catchError((error) => {
          alert('Er is een fout opgetreden bij het ophalen van de bestellingen.');
          return error;
        })
      )
      .subscribe()
  }

  increaseStatus(order: HubCheckoutTrackerI) {
    this.httpClient.post<HubCheckoutTrackerI>(`${apiEnviroment.apiUrl}checkout/tracker/step/${order.id}`, {})
      .pipe(
        take(1),
        map((checkout: HubCheckoutTrackerI) => {
          // Remove the order from the list if it's finished, or we are filtering on orders
          if (checkout.checkout_tracker_status === HubCheckoutTrackerStatusEnum.Finished || this.filter !== HubCheckoutTrackerStatusEnum.All) {
            // Immediately remove order from list
            this.orders = this.orders.filter((o) => o.id !== checkout.id);
          }
          return checkout;
        }),
        catchError((error) => {
          console.error(error);
          return error;
        })
      )
      .subscribe();
  }

  filterOrders(event: Event) {
    // Get value from event
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    // Parse as number and then as HubCheckoutTrackerStatusEnum
    this.filter = parseInt(value) as HubCheckoutTrackerStatusEnum;
  }

  isFood(transaction: TransactionI) {
    if (!this.filterDrinks) return true;
    return transaction.purchased_product.product_meta.categorie === 'food';
  }

  orderContainsFood(order: HubCheckoutTrackerI) {
    return order.checkout.transactions.some((transaction) => {
      return this.isFood(transaction);
    });
  }

  protected readonly HubCheckoutTrackerStatusEnum = HubCheckoutTrackerStatusEnum;
}
