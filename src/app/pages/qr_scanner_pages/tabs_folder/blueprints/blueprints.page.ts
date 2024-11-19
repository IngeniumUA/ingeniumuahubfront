import {Component} from '@angular/core';
import {currentPage, PageTrackingService, pageTree} from "@app_services/page-tracking.service";
import {NavController, Platform} from "@ionic/angular";
import {blueprintsDict, BlueprintsService} from "@app_services/qr-scanner_services/blueprints.service";
import {eventDict, GetEventsService, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {StorageService} from "@app_services/qr-scanner_services/storage.service";

@Component({
  selector: 'app-blueprints',
  templateUrl: './blueprints.page.html',
  styleUrls: ['./blueprints.page.scss'],
})
export class BlueprintsPage{
  public eventBlueprints: any = []
  public boxStates: any = {}

  public selectedItem = selectedEvent
  public events: any = undefined
  public actualEventSelected: boolean = false
  public showChooseEvent: boolean = true

  constructor(private navCtrl: NavController,
              private blueprintGetter: BlueprintsService,
              private storage: StorageService,
              private eventSetter: GetEventsService,
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
    this.setBlueprints()

    this.events = Object.keys(eventDict)
    this.selectedItem = selectedEvent
    if (this.selectedItem !== undefined) {this.showChooseEvent = false}
    this.actualEventSelected = !(this.selectedItem === undefined || this.selectedItem === 'Alle evenementen');
  }

  public setBlueprints() {
    this.blueprintGetter.getBlueprints().then((result) => {
      if (result === "server_error") {
        this.pageTrackService.setTreeToRoot()
        this.navCtrl.navigateRoot('').then()
      } else {
        this.eventBlueprints = Object.keys(blueprintsDict[selectedEvent])
        this.boxStates = blueprintsDict[selectedEvent]
      }
    })
  }

  public onItemSelection($selection: any) {
    if ( $selection != undefined) {
      this.selectedItem = $selection.detail.value;
      this.eventSetter.setEvent($selection.detail.value)
      this.showChooseEvent = false
      this.actualEventSelected = !(this.selectedItem === undefined || this.selectedItem === 'Alle evenementen');
      this.setBlueprints()
    }
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  public boxToggled() {
    this.blueprintGetter.dictSetter(this.boxStates, selectedEvent)
  }

  public clearBlueprints(event: any) {
    if (event.detail["data"] === undefined) {return}
    if (event.detail["data"]["action"] === "delete") {
      this.storage.clearSpecific("blueprints")
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
