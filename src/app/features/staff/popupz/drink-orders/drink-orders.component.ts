import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { apiEnviroment } from 'src/environments/environment';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-page',
    templateUrl: './drink-orders.component.html',
    styleUrls: ['./drink-orders.component.css'],
    imports: [NgFor, NgIf]
})
export class DrinkOrdersComponent implements OnInit {
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
