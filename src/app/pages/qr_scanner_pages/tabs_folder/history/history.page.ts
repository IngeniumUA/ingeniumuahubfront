import { Component } from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {historyList, HistoryUpdaterService} from "@app_services/qr-scanner_services/history-updater.service";
import {StorageService} from "@app_services/qr-scanner_services/storage.service";
import {currentPage, PageTrackingService, pageTree} from "@app_services/page-tracking.service";


@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage {
  public historyList = historyList
  constructor(private navCtrl: NavController,
              private storage: StorageService,
              private historyResetter: HistoryUpdaterService,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (pageTree[pageTree.length-2] === 'login') {
        this.ReturnToHome()
      } else {
        this.pageTrackService.popFromTree()
        this.navCtrl.navigateRoot('/'+currentPage).then()
      }
    });
  }

  public ionViewWillEnter() {
    this.historyList = historyList
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  public clearHistory(event: any) {
    if (event.detail["data"] === undefined) {return}
    if (event.detail["data"]["action"] === "delete") {
      this.storage.clearSpecific("history")
      this.historyResetter.clearHistory()
    }
  }

  public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

}
