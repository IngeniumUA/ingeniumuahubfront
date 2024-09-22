import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";

@Component({
  selector: 'app-staff-event-list',
  templateUrl: './staff-event-list.component.html',
  styleUrls: ['./staff-event-list.component.css']
})
export class StaffEventListComponent {

  events$: Observable<ItemWideI[]> = this.eventsService.getItems(50, 0, "eventitem");

  constructor(private eventsService: ItemWideService) {
  }
}
