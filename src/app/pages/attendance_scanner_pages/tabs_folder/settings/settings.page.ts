import {Component, ViewChild} from '@angular/core';
import {IonToggle, NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService, pageTree} from "@app_services/page-tracking.service";
import {StorageService} from "@app_services/qr-scanner_services/storage.service";

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  @ViewChild('returnToggle') returnToggle!: IonToggle
  @ViewChild('soundToggle') soundToggle!: IonToggle

  public showError:boolean = false
  public errorText: string = ""
  public inputReturnTime: string = ""

  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private storage: StorageService,
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
    this.storage.get("settings_attendance")?.then((result: any) => {
      if (result !== undefined) {
        doAutoReturn = result["autoReturn"];
        if (doAutoReturn) {
          this.returnToggle.checked = true
        }
        disableSound = result["soundDisable"];
        if (disableSound) {
          this.soundToggle.checked = true
        }
      }
    });

    if (doAutoReturn) {
      this.returnToggle.checked = true
    }
    if (disableSound) {
      this.soundToggle.checked = true
    }
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  public setAutoReturn() {
    doAutoReturn = this.returnToggle.checked
    this.storage.set("settings_attendance", {"autoReturn": this.returnToggle.checked})
  }

  public setDisableSound() {
    disableSound = this.soundToggle.checked
    this.storage.set("settings_attendance", {"soundDisable": this.soundToggle.checked})
  }

  public setReturnTime() {
    this.inputReturnTime.replace(",", ".")
    if (!isNaN(+this.inputReturnTime)) {
      this.showError = false
      this.errorText = ""
      returnTime = +this.inputReturnTime
      this.storage.set("settings_attendance", {"returnTime": this.inputReturnTime})
    } else {
      this.showError = true
      this.errorText = "Please enter a valid number"
    }
  }

  public clearMemory(event: any) {
    if (event.detail["data"] === undefined) {return}
    if (event.detail["data"]["action"] === "delete") {
        this.storage.reset()
    }
  }

  public clearSettings(event: any) {
    if (event.detail["data"] === undefined) {return}
    if (event.detail["data"]["action"] === "delete") {
      this.storage.clearSpecific("settings_attendance")
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

  protected readonly returnTime = returnTime;
}

export let doAutoReturn: boolean = false
export let disableSound: boolean = false

export let returnTime: number = 1
