import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '../../../../shared/models/item/recsysI';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import { isPlatformBrowser, AsyncPipe } from "@angular/common";
import { PublicHeaderComponent } from '../../../../core/layout/public/header/public-header.component';
import { RouterLink } from '@angular/router';
import { LoadingIndicatorComponent } from '../../../../shared/components/loading-indicator/loading-indicator.component';
import { RecSysItemPreviewComponent } from '../../../../shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';

@Component({
    selector: 'app-page',
    templateUrl: './shop-home.component.html',
    styleUrls: ['./shop-home.component.scss'],
    imports: [PublicHeaderComponent, RouterLink, LoadingIndicatorComponent, RecSysItemPreviewComponent, AsyncPipe]
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
