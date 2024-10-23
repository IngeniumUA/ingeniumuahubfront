import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";

@Component({
  selector: 'app-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events$: Observable<HttpState<RecSysPreviewI[]>> = this.eventService.getEventsList();

  constructor(private eventService: EventService) { }
}
