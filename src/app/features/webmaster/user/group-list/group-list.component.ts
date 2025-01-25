import { Component } from '@angular/core';
import {GroupService} from "@ingenium/app/core/services/coreAPI/group.service";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  constructor(private staffGroupService: GroupService) {
  }

  addingGroup: boolean = false

  ToggleAddingGroup() {
    this.addingGroup = !this.addingGroup
  }

  GroupCreated() {
    this.addingGroup = false;
  }
}
