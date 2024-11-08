import { Component } from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-info-lid',
  templateUrl: './info-lid.component.html',
  styleUrls: ['./info-lid.component.css']
})
export class InfoLidComponent {
  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

}
