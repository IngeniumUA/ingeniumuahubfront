import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {EventItemI} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/events/event.service";
import {LayoutService} from "../../../../core/services/layout/layout.service";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events$: Observable<EventItemI[]> = this.eventService.getEvents();
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  constructor(private eventService: EventService,
              private layoutService: LayoutService) {
  }
}
