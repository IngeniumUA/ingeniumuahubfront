import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {RecSysPreviewI} from '../../../../shared/models/items/recsys_interfaces';
import {LayoutService} from '../../../../core/services/layout/layout.service';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {HttpState} from "@ingenium/app/shared/models/httpState";

@Component({
  selector: 'app-page',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent {
  shopItems$: Observable<HttpState<RecSysPreviewI[]>> = this.shopService.getShopsList();
  cartCount$: Observable<number> = this.store.select(CartState.getProductCount);

  constructor(private shopService: ShopService,
              private store: Store) {}
}
