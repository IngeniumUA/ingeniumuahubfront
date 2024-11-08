import { Component } from '@angular/core';
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,) {}

  public gotoTab(tabName: string) {
    this.pageTrackService.addToTree('tabs/'+tabName)
    this.navCtrl.navigateRoot('/tabs/'+tabName).then()
  }

}
