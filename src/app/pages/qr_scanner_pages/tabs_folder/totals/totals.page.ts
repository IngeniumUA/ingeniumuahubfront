import { Component } from '@angular/core';
import {eventDict, GetEventsService, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {NavController, Platform} from "@ionic/angular";
import {historyList} from "@app_services/qr-scanner_services/history-updater.service";
import {currentPage, PageTrackingService, pageTree} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-totals',
  templateUrl: 'totals.page.html',
  styleUrls: ['totals.page.scss']
})
export class TotalsPage {
  public selectedItem = selectedEvent
  public events: any = undefined

  public totalApi: any = 0
  public totalLocal: any = 0

  constructor(private navCtrl: NavController,
              private eventService: GetEventsService,
              private platform: Platform,
              private pageTrackService: PageTrackingService) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (pageTree[pageTree.length-2] === 'login') {
        this.ReturnToHome()
      } else {
        this.pageTrackService.popFromTree()
        this.navCtrl.navigateRoot('/'+currentPage).then()
      }
    });
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  public ionViewWillEnter() {
    this.events = Object.keys(eventDict)
    this.selectedItem = selectedEvent
    this.totalApi = 0
    this.totalLocal = 0
    this.setTotal()
  }

  public onItemSelection($selection: any) {
    if ( $selection != undefined) {
      this.selectedItem = $selection.detail.value;
      this.eventService.setEvent($selection.detail.value)
      this.totalApi = 0
      this.totalLocal = 0
      this.setTotal()
    }
  }

  private setTotal() {
    if (this.selectedItem !== undefined) {
      if (this.selectedItem === "Alle evenementen") {
        this.totalApi = 0

        for (let historyItem of historyList) {
          if (historyItem[4] === "Automatisch gevalideerd" || historyItem[4] === "Invalid gevalideerd" || historyItem[4] === "Geldigheid aangepast naar consumed") {
            this.totalLocal = this.totalLocal + 1
          }
        }
      } else {
        let selectedItemId = eventDict[this.selectedItem]
        this.eventService.getEventStats(selectedItemId)
          .then((result) => {this.totalApi = result})

        for (let historyItem of historyList) {
          if (historyItem[0] === this.selectedItem && (historyItem[4] === "Automatisch gevalideerd" || historyItem[4] === "Invalid gevalideerd" || historyItem[4] === "Geldigheid aangepast naar consumed")) {
            this.totalLocal = this.totalLocal + 1
          }
        }
      }
    }
  }

}
