import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import { PromoService } from '@ingenium/app/core/services/coreAPI/item/derived_services/promo.service';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './vacatures-list-display.component.html',
  styleUrls: ['./vacatures-list-display.component.scss']
})
export class VacaturesListDisplayComponent {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacatures$: Observable<RecSysPreviewI[]> = this.promoService.getPromosList(50, 0, 1);

  constructor(private promoService: PromoService,
              private layoutService: LayoutService,) {
    backButtonClicked()
  }
}
