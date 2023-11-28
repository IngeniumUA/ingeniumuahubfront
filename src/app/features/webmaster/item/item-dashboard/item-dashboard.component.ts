import { Component } from '@angular/core';

@Component({
  selector: 'app-item-dashboard',
  templateUrl: './item-dashboard.component.html',
  styleUrls: ['./item-dashboard.component.css']
})
export class ItemDashboardComponent {

  addingNew: boolean = false
  ToggleAddNew() {
    this.addingNew = ! this.addingNew
  }

  Refetch() {
    this.addingNew = false
  }

}
