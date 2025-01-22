import { Component } from '@angular/core';
import {GroupService} from '@ingenium/app/core/services/coreAPI/group.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {
  CreateCheckoutComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/create/create-checkout/create-checkout.component";
import {
  CreateGroupComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/create/create-group/create-group.component";

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    CreateCheckoutComponent,
    CreateGroupComponent
  ],
  standalone: true
})
export class GroupTableComponent {
  constructor(private staffGroupService: GroupService) {
  }

  addingGroup: boolean = false
  groups$: Observable<[]> = this.staffGroupService.getGroupTable();

  loadData() {
   this.groups$ = this.staffGroupService.getGroupTable();
  }

  ToggleAddingGroup() {
    this.addingGroup = !this.addingGroup
  }

  GroupCreated() {
    this.addingGroup = false;
    this.loadData()
  }
}
