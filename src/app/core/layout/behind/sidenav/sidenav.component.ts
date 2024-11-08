import {Component, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {Store} from "@ngxs/store";
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {GetEventsService} from "@app_services/qr-scanner_services/get-events.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    AsyncPipe
  ]
})
export class SidenavComponent {
  @Input() isSidenav: boolean = true;

  isWebmaster$: Observable<boolean> = this.store.select(state => state.user.roles.is_webmaster);
  isManager$: Observable<boolean> = this.store.select(state => state.user.roles.is_manager);

  constructor(private store: Store,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private eventsService: GetEventsService,
  ) {
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

  gotoScanner() {
    this.eventsService.getEvents().then(
      (result) => {
        if (result === "success") {
          this.pageTrackService.addToTree("tabs/scan")
          this.navCtrl.navigateRoot('/tabs/scan').then()
        } else {
          console.log(result)
        }
      })
  }

}
