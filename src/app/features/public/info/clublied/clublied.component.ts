import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './clublied.component.html',
  styleUrls: ['./clublied.component.css']
})
export class ClubliedComponent {

  constructor() {
    backButtonClicked()
  }

}
