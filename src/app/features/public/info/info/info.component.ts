import { Component } from '@angular/core';
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  constructor(private appFunctionsService: AppFunctionsService) {
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
