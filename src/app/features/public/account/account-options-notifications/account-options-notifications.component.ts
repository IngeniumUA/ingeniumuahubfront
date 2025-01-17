import { Component, OnInit } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-account-options-notifications',
  templateUrl: './account-options-notifications.component.html',
  styleUrls: ['./account-options-notifications.component.scss'],
})
export class AccountOptionsNotificationsComponent  implements OnInit {

  constructor() {
    backButtonClicked()
  }

  ngOnInit() {
    console.log("Account Options")
  }

}
