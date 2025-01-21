import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { ItemTableComponent } from '../../../../shared/components/staff_webmaster_manager/tables/item-table/item-table.component';
import { ItemCreateComponent } from '../../../../shared/components/staff_webmaster_manager/create/item-create/item-create.component';

@Component({
    selector: 'app-item-dashboard',
    templateUrl: './items-overview-page.component.html',
    imports: [NgIf, ItemTableComponent, ItemCreateComponent]
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
