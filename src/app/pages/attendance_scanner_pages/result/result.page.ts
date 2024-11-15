import {Component, ViewChild} from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {scannedQr} from "../tabs_folder/scan/scan.page";
import {eventDict, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {currentPage, pageTree, PageTrackingService} from "@app_services/page-tracking.service";
import {HandCode} from "../tabs_folder/handscan/handscan.page";
import {disableSound, doAutoReturn, returnTime} from "../tabs_folder/settings/settings.page";
import {NativeAudio} from "@capgo/native-audio";
import {PostInteractionService} from "@app_services/qr-scanner_services/post-interaction.service";


@Component({
  selector: 'app-result',
  templateUrl: 'result.page.html',
  styleUrls: ['result.page.scss']
})
export class ResultPage {
  @ViewChild('More') moreModal: any;
  @ViewChild('userChange') userChangeModal: any;

  public imgPath: string = "../../../../assets/qr-scanner/sync.png"

  private code: string = ""

  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private createInteractionService: PostInteractionService,
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
    this.createInteractionService.processInteraction(this.code , eventDict[selectedEvent]).then((result) => {
      if (result === "server_error") {
        this.pageTrackService.setTreeToRoot()
        this.navCtrl.navigateRoot('').then()
      } else if (result === "interaction_exists") {
        this.loadElements("consumed").then()
      } else {
        this.loadElements("valid").then()
      }
    })
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(
      (resolve) => setTimeout(resolve, ms));
  }

  private async loadElements(validity: string = "") {
    if (validity === "valid") {
      this.imgPath = "../../../../assets/qr-scanner/checkmark.png"
      if (!disableSound) {await this.playAudio("oneBeep")}
      if (doAutoReturn) {
        await this.sleep(returnTime*1000)
        this.Back()
      }
    } else {
      this.imgPath = "../../../../assets/qr-scanner/xmark.png"
      if (!disableSound) {await this.playAudio("longBeep")}
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

}
