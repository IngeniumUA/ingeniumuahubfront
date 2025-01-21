import {afterNextRender, Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import { NgOptimizedImage, AsyncPipe } from '@angular/common';
import { PublicHeaderComponent } from '../../../core/layout/public/header/public-header.component';
import { RouterLink } from '@angular/router';
import { RecSysItemPreviewComponent } from '../../../shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import { PartnerGridComponent } from '../../../shared/components/partners/partner-grid/partner-grid.component';
import { PublicFooterComponent } from '../../../core/layout/public/footer/public-footer.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
    imports: [NgOptimizedImage, PublicHeaderComponent, RouterLink, RecSysItemPreviewComponent, PartnerGridComponent, PublicFooterComponent, AsyncPipe]
})
export class HomepageComponent {
  homePageRec$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: false, data: [], error: null});
  recsysItems$: Observable<RecSysPreviewI[]> = of();

  constructor(private eventService: EventService, private promoService: PromoService) {
    this.homePageRec$ = this.eventService.getEventsList();
    this.recsysItems$ = this.promoService.getPromosList(8, 0);
  }
}
