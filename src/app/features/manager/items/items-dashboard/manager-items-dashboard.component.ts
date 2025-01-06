import {Component} from '@angular/core';
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-items',
  templateUrl: './manager-items-dashboard.component.html',
  styleUrls: ['./manager-items-dashboard.component.css']
})
export class ManagerItemsDashboardComponent {
  constructor(private appFunctionsService: AppFunctionsService, ) {
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
