import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {LayoutService} from '../../../../core/services/layout/layout.service';
import {RecSysPreviewI} from '../../../../shared/models/items/recsys_interfaces';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";

@Component({
  selector: 'app-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events$: Observable<RecSysPreviewI[]> = this.eventService.getEventsList();
  isMobile$: Observable<boolean> = this.layoutService.isMobile;

  constructor(private eventService: EventService, private layoutService: LayoutService) {}
}
