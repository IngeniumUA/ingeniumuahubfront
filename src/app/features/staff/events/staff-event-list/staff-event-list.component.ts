import { Component } from '@angular/core';
import {EventService} from '../../../../core/services/items/events/event.service';
import {Observable} from 'rxjs';
import {EventItemDetailI} from '../../../../shared/models/items/events';

@Component({
  selector: 'app-staff-event-list',
  templateUrl: './staff-event-list.component.html',
  styleUrls: ['./staff-event-list.component.css']
})
export class StaffEventListComponent {

  events$: Observable<EventItemDetailI[]> = this.eventsService.getEvents();

  constructor(private eventsService: EventService) {
  }
}
