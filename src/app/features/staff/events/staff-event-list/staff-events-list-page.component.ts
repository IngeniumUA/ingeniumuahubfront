import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-staff-events-list',
  templateUrl: './staff-events-list-page.component.html',
  styleUrls: ['./staff-events-list-page.component.css']
})
export class StaffEventsListPageComponent {

  events$: Observable<ItemWideI[]> = this.eventsService.getItems(50, 0, "eventitem");

  constructor(private eventsService: ItemWideService,
              private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
