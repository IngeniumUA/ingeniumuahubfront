import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events$: Observable<HttpState<RecSysPreviewI[]>> = of({loading: true, data: [], error: null});

  constructor(private eventService: EventService,) {
    this.events$ = eventService.getEventsList();
    backButtonClicked()
  }
}
