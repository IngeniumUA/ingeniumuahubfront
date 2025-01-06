import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent {
  constructor() {
    backButtonClicked()
  }

}
