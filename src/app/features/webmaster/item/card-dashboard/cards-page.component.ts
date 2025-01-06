import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './cards-page.component.html',
  // styleUrls: ['./cards-page.component.css']
})
export class CardsPageComponent {
  constructor() {
    backButtonClicked()
  }

}
