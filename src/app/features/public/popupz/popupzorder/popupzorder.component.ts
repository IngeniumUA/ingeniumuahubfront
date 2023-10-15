import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { apiEnviroment } from "../../../../../enviroments";

@Component({
  selector: 'app-popupzorder',
  templateUrl: './popupzorder.component.html',
  styleUrls: ['./popupzorder.component.css']
})
export class PopupzorderComponent {
  orders: any[] = [];

  constructor(private httpService: HttpClient) {}

  ngOnInit() {
    interval(5000)
      .pipe(
          mergeMap(() => this.httpService.get<any[]>(apiEnviroment.apiEnv['apiUrl'] + "popup/cache/order_progress"))
      )
      .subscribe((data) => {
        this.orders = data;
      });
  }
}
