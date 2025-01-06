import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-popupz-allergies',
  standalone: true,
  imports: [],
  templateUrl: './popupz-allergies.component.html',
  styleUrl: './popupz-allergies.component.scss'
})
export class PopupzAllergiesComponent {
  constructor() {
    backButtonClicked()
  }

}
