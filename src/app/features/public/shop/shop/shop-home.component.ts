import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '../../../../shared/models/items/recsys_interfaces';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

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
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.shopItems$ = this.shopService.getShopItems();
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/' + currentPage).then()
    });
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }
}
