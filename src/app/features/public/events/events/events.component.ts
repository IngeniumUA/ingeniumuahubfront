import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {EventService} from "../../../../core/services/items/events/event.service";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {RecSysPreviewI} from "../../../../shared/models/items/recsys_interfaces";

@Component({
  selector: 'app-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events$: Observable<RecSysPreviewI[]> = this.eventService.getEventsList();
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  constructor(private eventService: EventService,
              private layoutService: LayoutService) {
  }
}
