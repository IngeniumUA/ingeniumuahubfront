import {afterNextRender, Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  homePageRec$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: false, data: [], error: null});
  recsysItems$: Observable<RecSysPreviewI[]> = of();

  constructor(private eventService: EventService,
              private promoService: PromoService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    afterNextRender(() => { // Without this in pre-rendering we would get outdated data from the server
      this.homePageRec$ = this.eventService.getEventsList();
      this.recsysItems$ = this.promoService.getPromosList(8, 0);
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
