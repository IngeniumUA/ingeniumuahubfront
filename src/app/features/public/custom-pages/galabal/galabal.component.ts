import {Component, OnInit} from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-galabal',
  templateUrl: './galabal.component.html',
  styleUrls: ['./galabal.component.css']
})
export class GalabalComponent implements OnInit {
  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    window.location.href = 'https://fb.me/e/1zHXJKSiS';
  }

}
