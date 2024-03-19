import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, interval, mergeMap } from 'rxjs';
import { CheckoutI } from 'src/app/shared/components/items/interactions/checkout';
import { apiEnviroment } from 'src/environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './drink-orders.component.html',
  styleUrls: ['./drink-orders.component.css']
})
export class DrinkOrdersComponent {
  constructor(private httpService: HttpClient) {}
  orders: any = [];

  ngOnInit() {
    interval(5000)
      .pipe(
        mergeMap(() => this.httpService.get<any>(apiEnviroment.apiUrl + 'popup/cache/drinks_snacks_dashboard'))
      )
      .subscribe((data) => {
        this.orders = data;
      });
  }

  public removeOrder(order: any, index: number): void {
    // Remove item from database
    this.httpService.post(apiEnviroment.apiUrl + 'popup/cache/delete/' + order.order_no, null).subscribe();

    // Remove item from orders
    this.orders.splice(index, 1);
  }
}
