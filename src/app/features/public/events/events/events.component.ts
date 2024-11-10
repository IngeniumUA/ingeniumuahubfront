import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: true, data: [], error: null});

  constructor(private eventService: EventService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.events$ = eventService.getEventsList();
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }
}
