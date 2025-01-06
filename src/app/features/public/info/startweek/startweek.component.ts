import { Component } from '@angular/core';
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-startweek',
  templateUrl: './startweek.component.html',
  styleUrls: ['./startweek.component.css']
})
export class StartweekComponent {
  constructor(private appFunctionsService: AppFunctionsService) {
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
