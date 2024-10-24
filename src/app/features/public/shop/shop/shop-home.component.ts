import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '../../../../shared/models/items/recsys_interfaces';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-page',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent {
  shopItems$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: true, data: [], error: null});
  cartCount$: Observable<number> = this.store.select(CartState.getProductCount);

  constructor(@Inject(PLATFORM_ID) platformId: any, private shopService: ShopService, private store: Store) {
    if (isPlatformBrowser(platformId)) {
      this.shopItems$ = this.shopService.getShopItems();
    }
  }
}
