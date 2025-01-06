import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-education-info',
  templateUrl: './education-info.component.html',
  styleUrls: ['./education-info.component.css']
})
export class EducationInfoComponent {
  constructor() {
    backButtonClicked()
  }

}
