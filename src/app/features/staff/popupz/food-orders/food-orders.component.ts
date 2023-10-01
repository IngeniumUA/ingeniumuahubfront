import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, mergeMap } from 'rxjs';
import { apiEnviroment } from 'src/enviroments';

@Component({
  selector: 'app-food-orders',
  templateUrl: './food-orders.component.html',
  styleUrls: ['./food-orders.component.css']
})
export class FoodOrdersComponent {
  constructor(private httpService: HttpClient) {}
  orders: any = [];

  ngOnInit() {
    interval(5000)
      .pipe(
          mergeMap(() => this.httpService.get<any>(apiEnviroment.apiUrl + "popup/cache/food_dashboard"))
      )
      .subscribe((data) => {
        this.orders = data;
      });
  }

  public removeOrder(product: any): void {
    // TODO: remove order
  }

  public toggleOrderFinished(product: any): void {
    // TODO: finish order
  }
}
