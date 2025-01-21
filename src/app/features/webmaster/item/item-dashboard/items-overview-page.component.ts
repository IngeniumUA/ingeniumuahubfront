import { Component } from '@angular/core';

@Component({
    selector: 'app-item-dashboard',
    templateUrl: './items-overview-page.component.html',
    standalone: false
})
export class ItemsOverviewPageComponent {

  addingNew: boolean = false;
  ToggleAddNew() {
    this.addingNew = ! this.addingNew;
  }

  Refetch() {
    this.addingNew = false;
  }

}
