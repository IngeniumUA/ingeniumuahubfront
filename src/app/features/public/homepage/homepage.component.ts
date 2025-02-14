import {afterNextRender, Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  homePageRec$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: false, data: [], error: null});
  recsysItems$: Observable<RecSysPreviewI[]> = of();

  constructor(private eventService: EventService, private promoService: PromoService) {
    afterNextRender(() => { // Without this in pre-rendering we would get outdated data from the server
      this.homePageRec$ = this.eventService.getEventsList();
      this.recsysItems$ = this.promoService.getPromosList(8, 0);
    });
  }
}
