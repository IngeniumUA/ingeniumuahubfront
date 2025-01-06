import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-payment-code',
  templateUrl: './staff-usefull-q-r.component.html',
  styleUrls: ['./staff-usefull-q-r.component.css']
})
export class StaffUseFullQRComponent {
  constructor() {
    backButtonClicked()
  }
}
