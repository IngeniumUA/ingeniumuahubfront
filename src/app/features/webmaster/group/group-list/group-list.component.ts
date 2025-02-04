import { Component } from '@angular/core';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent {
  addingGroup: boolean = false

  ToggleAddingGroup() {
    this.addingGroup = !this.addingGroup
  }

  GroupCreated() {
    this.addingGroup = false;
  }
}
