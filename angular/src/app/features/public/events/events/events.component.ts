import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: true, data: [], error: null});

  constructor(@Inject(PLATFORM_ID) platformId: any, eventService: EventService) {
    if (isPlatformBrowser(platformId)) {
      this.events$ = eventService.getEventsList();
    }
  }
}
