import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import { NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-staff-events-list',
    templateUrl: './staff-events-list-page.component.html',
    styleUrls: ['./staff-events-list-page.component.css'],
    imports: [NgFor, RouterLink, AsyncPipe]
})
export class StaffEventsListPageComponent {

  events$: Observable<ItemWideI[]> = this.eventsService.getItems(50, 0, "eventitem");

  constructor(private eventsService: ItemWideService) {
  }
}
