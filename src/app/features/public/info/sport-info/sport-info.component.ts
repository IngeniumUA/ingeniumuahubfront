import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-sport-info',
  templateUrl: './sport-info.component.html',
  styleUrls: ['./sport-info.component.css']
})
export class SportInfoComponent {
  constructor() {
    backButtonClicked()
  }

}
