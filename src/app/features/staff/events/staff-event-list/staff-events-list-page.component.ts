import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";

@Component({
    selector: 'app-staff-events-list',
    templateUrl: './staff-events-list-page.component.html',
    styleUrls: ['./staff-events-list-page.component.css'],
    standalone: false
})
export class StaffEventsListPageComponent {

  events$: Observable<ItemWideI[]> = this.eventsService.getItems(50, 0, "eventitem");

  constructor(private eventsService: ItemWideService) {
  }
}
