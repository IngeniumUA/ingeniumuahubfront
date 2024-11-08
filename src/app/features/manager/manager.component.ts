import { Component } from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent {
  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }
  isSideNav: boolean = true;

  ToggleSideNav(): void {
    this.isSideNav = !this.isSideNav;
  }
}
