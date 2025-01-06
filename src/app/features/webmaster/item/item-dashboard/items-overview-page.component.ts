import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-item-dashboard',
  templateUrl: './items-overview-page.component.html',
  // styleUrls: ['./items-overview-page.component.css']
})
export class ItemsOverviewPageComponent {

  constructor() {
    backButtonClicked()
  }

  addingNew: boolean = false;
  ToggleAddNew() {
    this.addingNew = ! this.addingNew;
  }

  Refetch() {
    this.addingNew = false;
  }

}
