import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ProductOutI} from "@ingenium/app/shared/models/product/products";
import {ProductsService} from "@ingenium/app/core/services/coreAPI/products.service";
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-galabal',
  templateUrl: './galabal.component.html',
  styleUrls: ['./galabal.component.css']
})
export class GalabalComponent implements OnInit {
  constructor(private productService: ProductsService,) {
    backButtonClicked()
  }

  ngOnInit() {
    window.location.href = 'https://fb.me/e/1zHXJKSiS';
  }

  products$: Observable<ProductOutI[]> = this.productService.getProducts("Ingenium Galabal");
  // $galabalItem: Observable<HttpState<ItemWideLimitedI>> = this.eventService.getEvent("Ingenium%20Galabal");

  // ngOnInit() {
  //   // this.eventService.getEvent("Ingenium%20Galabal").subscribe({
  //   //   next: item => {
  //   //     if (item.data === undefined || item.data === null) {
  //   //       window.location.href = 'https://www.facebook.com/events/1660039801532627?acontext=%7B%22event_action_history%22%3A[]%7D';
  //   //       return
  //   //     }
  //   //     const eventItem = item.data as EventItemWideI;
  //   //     const url = eventItem.derived_type.display.follow_through_link
  //   //     if (url.startsWith("http")) {
  //   //       window.location.href = url;
  //   //     } else {
  //   //       window.location.href = `https://ingeniumua.be/${url}`;
  //   //     }
  //   //   },
  //   //   error: (_: Error) => {
  //   //     window.location.href = 'https://www.facebook.com/events/1660039801532627?acontext=%7B%22event_action_history%22%3A[]%7D';
  //   //   }
  //   // })
  // }

}
