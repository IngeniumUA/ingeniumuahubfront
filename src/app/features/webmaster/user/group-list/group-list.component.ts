import { Component } from '@angular/core';
import {backButtonClicked} from "@app_services/app-functions.service";
import {GroupService} from "@ingenium/app/core/services/coreAPI/group.service";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  constructor(private staffGroupService: GroupService) {
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
