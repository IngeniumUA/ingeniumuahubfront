import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, ToastController} from "@ionic/angular";
import {scannedQr} from "../tabs_folder/scan/scan.page";
import {GetQrDataService, QrData} from "@app_services/qr-scanner_services/get-qr-data.service";
import {eventDict, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {currentPage, pageTree, PageTrackingService} from "@app_services/page-tracking.service";
import {HandCode} from "../tabs_folder/handscan/handscan.page";
import {disableSound, doAutoReturn, returnTime} from "../tabs_folder/settings/settings.page";
import {NativeAudio} from "@capgo/native-audio";
import {blueprintsDict} from "@app_services/qr-scanner_services/blueprints.service";


@Component({
  selector: 'app-result',
  templateUrl: 'result.page.html',
  styleUrls: ['result.page.scss']
})
export class ResultPage {
  @ViewChild('More') moreModal: any;
  @ViewChild('userChange') userChangeModal: any;

  public UserItem: string = ""
  public UserBlueprint: string = ""
  public UserPolicyName: string = ""
  public UserId = ""

  private savedResult: QrData | undefined = undefined

  public imgPath: string = "../../../../assets/qr-scanner/sync.png"

  private code: string = ""

  constructor(private navCtrl: NavController,
              private toastCtrl: ToastController,
              private QrService: GetQrDataService,
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
    if (pageTree[pageTree.length-2] === "tabs_attendance/scan") {this.code = scannedQr} else if (pageTree[pageTree.length-2] === "tabs_attendance/handscan") {this.code = HandCode}
    this.QrService.getQrData(eventDict[selectedEvent], this.code).then((result) => {
      if (typeof result === "string") {
        if (result === "server_error") {
          this.pageTrackService.setTreeToRoot()
          this.navCtrl.navigateRoot('').then()
        } else if (result === "no_event") {
          this.Back()
        } else {
          this.loadElements(false).then()
        }
      } else {
        this.savedResult = result
        this.loadElements(true, result.validity, result).then()
      }
    })
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(
      (resolve) => setTimeout(resolve, ms));
  }

  private async loadElements(Succeeded: boolean, validity: string = "", result: QrData | undefined = undefined, runAutoValidate: boolean = true) {
    if (Succeeded) {
      if (typeof result !== "undefined") {
        this.UserId = result.id
        this.UserItem = result.productString
        this.UserBlueprint = result.blueprintName
        this.UserPolicyName = result.pricePolicyName
        if (this.UserItem.length)

        if (blueprintsDict[selectedEvent] !== undefined) {
          if (!blueprintsDict[selectedEvent][this.UserBlueprint]) {
            validity = "consumed"
          }
        }
      }
      if (validity === "valid") {
        this.imgPath = "../../../../assets/qr-scanner/checkmark.png"
        if (runAutoValidate) {
          this.AutoRegister(this.UserId)
          if (!disableSound) {await this.playAudio("oneBeep")}
        }
        if (doAutoReturn) {
          await this.sleep(returnTime*1000)
          this.Back()
        }
      } else if (validity === "invalid") {
        this.imgPath = "../../../../assets/qr-scanner/dashmark.png"
        if (!disableSound) {await this.playAudio("twoBeep")}
      } else {
        this.imgPath = "../../../../assets/qr-scanner/xmark.png"
        if (!disableSound) {await this.playAudio("longBeep")}
      }

    } else {
      this.imgPath = "../../../../assets/qr-scanner/xmark.png"
    }
  }

  async playAudio(soundId: string) {
    try {
      await NativeAudio.play({
        assetId: soundId
      })
    } catch (e) {
      console.log(e)
    }
  }

  public Back() {
    if (currentPage === "result_attendance") {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/' + currentPage).then()
    }
  }

  public ReturnToHome() {
    this.pageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
  }

  private AutoRegister(interactionID: string) {

  }

}
