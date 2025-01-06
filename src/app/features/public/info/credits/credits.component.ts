import { Component } from '@angular/core';
import {apiEnviroment} from "@ingenium/environments/environment";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent {
  revision: string = apiEnviroment.versions.revision;

  constructor(private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
