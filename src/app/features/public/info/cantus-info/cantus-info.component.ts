import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-cantus-info',
  templateUrl: './cantus-info.component.html',
  styleUrls: ['./cantus-info.component.css']
})
export class CantusInfoComponent {
  constructor() {
    backButtonClicked()
  }

}
