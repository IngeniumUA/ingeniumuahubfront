import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {EventItemI} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/events/event.service";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events$: Observable<EventItemI[]> = this.eventService.getEvents();

  constructor(private eventService: EventService) {
  }
}
