import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import { PromoService } from '@ingenium/app/core/services/coreAPI/item/derived_services/promo.service';
import { PublicHeaderComponent } from '../../../../../core/layout/public/header/public-header.component';
import { NgClass, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RecSysItemPreviewComponent } from '../../../../../shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import { PartnerGridComponent } from '../../../../../shared/components/partners/partner-grid/partner-grid.component';

@Component({
    selector: 'app-page',
    templateUrl: './vacatures-list-display.component.html',
    styleUrls: ['./vacatures-list-display.component.scss'],
    imports: [PublicHeaderComponent, NgClass, NgIf, NgFor, RecSysItemPreviewComponent, PartnerGridComponent, AsyncPipe]
})
export class VacaturesListDisplayComponent {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacatures$: Observable<RecSysPreviewI[]> = this.promoService.getPromosList(50, 0, 1);

  constructor(private promoService: PromoService,
              private layoutService: LayoutService) {
  }
}
