import {Component} from '@angular/core';
import {eventDict, GetEventsService, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {currentPage, PageTrackingService, pageTree} from "@app_services/page-tracking.service";
import {NavController, Platform} from "@ionic/angular";
import {StorageService} from "@app_services/qr-scanner_services/storage.service";
import {PriceDict} from "@app_services/qr-scanner_services/prices.service";


@Component({
  selector: 'app-prices',
  templateUrl: 'prices.page.html',
  styleUrls: ['prices.page.scss']
})
export class PricesPage{
  EventPrice: number = 0;
  DisplayPrice: string = "Niet ingesteld"
  InputPrice: string = ""

  public selectedItem = selectedEvent
  public events: any = undefined

  constructor(private navCtrl: NavController,
              private eventSetter: GetEventsService,
              private storage: StorageService,
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
    this.events = Object.keys(eventDict)
    this.selectedItem = selectedEvent

    let uuids: any = Object.values(eventDict)

    let PriceDictKeys = Object.keys(PriceDict)
    for (let id of uuids) {
      if (!PriceDictKeys.includes(id)) {
        PriceDict[id] = -1
        let storageDict: any = {}
        storageDict[id] = -1
        this.storage.set("prices", storageDict)
      }
    }
    if (this.selectedItem !== undefined) {
      this.EventPrice = PriceDict[eventDict[this.selectedItem]]
      if (this.EventPrice === -1) {
        this.DisplayPrice = "Niet ingesteld"
      } else {
        this.DisplayPrice = this.EventPrice.toFixed(2)
      }
    }
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  public Back() {
    this.pageTrackService.popFromTree()
    this.navCtrl.navigateRoot('/'+currentPage).then()
  }

  public SetPrice() {
    let eventUUID = eventDict[this.selectedItem]
    if (this.InputPrice !== "") {
      PriceDict[eventUUID] = +this.InputPrice
      let storageDict: any = {}
      storageDict[eventUUID] = +this.InputPrice
      this.storage.set("prices", storageDict)
    }
    this.Back()
  }

  public onItemSelection($selection: any) {
    if ( $selection != undefined) {
      this.selectedItem = $selection.detail.value;
      this.eventSetter.setEvent($selection.detail.value)

      this.EventPrice = PriceDict[eventDict[this.selectedItem]]
      if (this.EventPrice === -1) {
        this.DisplayPrice = "Niet ingesteld"
      } else {
        this.DisplayPrice = this.EventPrice.toFixed(2)
      }
    }
  }

  public clearPrices(event: any) {
    if (event.detail["data"] === undefined) {return}
    if (event.detail["data"]["action"] === "delete") {
      this.storage.clearSpecific("prices")
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
