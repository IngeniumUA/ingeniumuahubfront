import {inject, Injectable} from '@angular/core';
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";
import {NavController, Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AppFunctionsService {

  constructor(private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) { }

  public backButtonClicked() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  public goToPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}

export function backButtonClicked() {
  const appFunctions = inject(AppFunctionsService)
  appFunctions.backButtonClicked()
}
