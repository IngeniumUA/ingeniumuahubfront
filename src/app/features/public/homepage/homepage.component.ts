import {afterNextRender, Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  homePageRec$: Observable<RecSysPreviewI[]> = of([]);
  recsysItems$: Observable<RecSysPreviewI[]> = of();

  constructor(private eventService: EventService, private promoService: PromoService) {
    afterNextRender(() => { // Without this in pre-rendering we would get outdated data from the server
      this.homePageRec$ = this.eventService.getEventsList();
      this.recsysItems$ = this.promoService.getPromosList(8, 0);
    });
  }
}
