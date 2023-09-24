import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {RecSysPreviewI} from "../../../../shared/models/items/recsys_interfaces";
import {EventService} from "../../../../core/services/items/events/event.service";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {ShopService} from "../../../../core/services/items/shop.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.css']
})
export class ShopHomeComponent {
  shopitems$: Observable<RecSysPreviewI[]> = this.shopService.getShopitemsList();
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  constructor(private shopService: ShopService,
              private layoutService: LayoutService) {
  }
}
