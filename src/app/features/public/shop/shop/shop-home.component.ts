import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '../../../../shared/models/item/recsysI';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './shop-home.component.html',
  styleUrls: ['./shop-home.component.scss']
})
export class ShopHomeComponent {
  shopItems$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: true, data: [], error: null});
  cartCount$: Observable<number> = this.store.select(CartState.getProductCount);

  constructor(private shopService: ShopService,
              private store: Store,
              private appFunctionsService: AppFunctionsService,) {
    this.shopItems$ = this.shopService.getShopItems();
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}
}
