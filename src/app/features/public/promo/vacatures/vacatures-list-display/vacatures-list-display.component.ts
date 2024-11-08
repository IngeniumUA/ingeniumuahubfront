import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import { PromoService } from '@ingenium/app/core/services/coreAPI/item/derived_services/promo.service';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-page',
  templateUrl: './vacatures-list-display.component.html',
  styleUrls: ['./vacatures-list-display.component.scss']
})
export class VacaturesListDisplayComponent {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacatures$: Observable<RecSysPreviewI[]> = this.promoService.getPromosList(50, 0);

  constructor(private promoService: PromoService,
              private layoutService: LayoutService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }
}
