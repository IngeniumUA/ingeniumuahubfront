import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-doop-info',
  templateUrl: './doop-info.component.html',
  styleUrls: ['./doop-info.component.css']
})
export class DoopInfoComponent {
  constructor() {
    backButtonClicked()
  }

}
