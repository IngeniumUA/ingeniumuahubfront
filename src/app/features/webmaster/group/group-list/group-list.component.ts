import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  constructor() {
    backButtonClicked()
  }

  addingGroup: boolean = false

  ToggleAddingGroup() {
    this.addingGroup = !this.addingGroup
  }

  GroupCreated() {
    this.addingGroup = false;
  }
}
