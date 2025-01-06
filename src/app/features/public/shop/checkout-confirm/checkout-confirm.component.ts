import { Component } from '@angular/core';
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-checkout-confirm',
  templateUrl: './checkout-confirm.component.html'
})
export class CheckoutConfirmComponent {
  constructor(private appFunctionsService: AppFunctionsService) {
    backButtonClicked()
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
