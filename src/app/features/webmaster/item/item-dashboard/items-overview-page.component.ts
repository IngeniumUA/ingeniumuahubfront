import { Component } from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-item-dashboard',
  templateUrl: './items-overview-page.component.html',
  // styleUrls: ['./items-overview-page.component.css']
})
export class ItemsOverviewPageComponent {

  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  addingNew: boolean = false;
  ToggleAddNew() {
    this.addingNew = ! this.addingNew;
  }

  Refetch() {
    this.addingNew = false;
  }

}
