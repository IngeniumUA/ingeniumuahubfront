import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './notfoundpage.component.html',
  styleUrls: ['./notfoundpage.component.css']
})
export class NotfoundpageComponent {
  constructor() {
    backButtonClicked()
  }

}
