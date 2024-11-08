import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-staff-event-list',
  templateUrl: './staff-event-list.component.html',
  styleUrls: ['./staff-event-list.component.css']
})
export class StaffEventListComponent {

  events$: Observable<ItemWideI[]> = this.eventsService.getItems(50, 0, "eventitem");

  constructor(private eventsService: ItemWideService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }
}
