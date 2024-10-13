import { Component } from '@angular/core';
import {GroupService} from '../../../../../core/services/coreAPI/group/group.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {GroupI} from '../../../../models/group/HubGroup';
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
  groups$: Observable<GroupI[]> = this.staffGroupService.GetGroupsList();

  LoadData() {
   this.groups$ = this.staffGroupService.GetGroupsList();
  }

  ToggleAddingGroup() {
    this.addingGroup = !this.addingGroup
  }

  GroupCreated() {
    this.addingGroup = false;
    this.LoadData()
  }
}
