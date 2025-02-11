import {Component, Input} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {Store} from "@ngxs/store";
import {GetEventsService} from "@app_services/qr-scanner_services/get-events.service";
import {AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ]
})
export class SidenavComponent {
  @Input() isSidenavInput: boolean = true;

  isSideNav: boolean = true;

  isWebmaster$: Observable<boolean> = this.store.select(state => state.user.roles?.includes('webmaster'));
  isManager$: Observable<boolean> = this.store.select(state => state.user.roles?.includes('manager'));

  constructor(private store: Store,
              private eventsService: GetEventsService,
              private appFunctionsService: AppFunctionsService,
  ) {
  }

  toggleSideNav() {
    this.isSideNav = !this.isSideNav;
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

  gotoScanner(isTicketScanner: boolean) {
    let scanner
    if (isTicketScanner) {
      scanner = "tabs/scan"
    } else {
      scanner = "tabs_attendance/scan"
    }
    this.eventsService.getEvents().then(
      (result) => {
        if (result === "success") {
          this.gotoPage(scanner)
        } else {
          console.log(result)
        }
      })
  }

}
