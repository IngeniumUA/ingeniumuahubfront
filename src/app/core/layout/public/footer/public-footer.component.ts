import {Component} from '@angular/core';
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {LayoutService} from '../../../services/layout/layout.service';
import {Observable} from 'rxjs';
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {apiEnviroment} from "@ingenium/environments/environment";

@Component({
  standalone: true, // Allows it to be imported outside of routing
  selector: 'app-layout-public-footer',
  templateUrl: './public-footer.component.html',
  imports: [
    NgClass,
    AsyncPipe,
    NgIf,
    NgOptimizedImage
  ],
  styleUrls: ['./public-footer.component.scss']
})
export class PublicFooterComponent {
  isMobile$: Observable<boolean> = this.layoutService.isMobile;

  constructor(private layoutService: LayoutService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,) {
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
