import { Component } from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-cantus-info',
  templateUrl: './cantus-info.component.html',
  styleUrls: ['./cantus-info.component.css']
})
export class CantusInfoComponent {
  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

}
