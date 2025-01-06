import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-info-lid',
  templateUrl: './info-lid.component.html',
  styleUrls: ['./info-lid.component.css']
})
export class InfoLidComponent {
  constructor() {
    backButtonClicked()
  }

}
