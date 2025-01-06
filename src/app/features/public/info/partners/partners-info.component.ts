import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-partners',
  templateUrl: './partners-info.component.html',
  styleUrls: ['./partners-info.component.css']
})
export class PartnersInfoComponent {
  constructor() {
    backButtonClicked()
  }

}
