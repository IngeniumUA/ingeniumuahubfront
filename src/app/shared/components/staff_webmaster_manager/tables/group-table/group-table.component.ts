import { Component } from '@angular/core';
import {GroupService} from '../../../../../core/services/coreAPI/group/group.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {GroupI} from '../../../../models/group/HubGroup';

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class GroupTableComponent {
  constructor(private staffGroupService: GroupService) {
  }

  groups$: Observable<GroupI[]> = this.staffGroupService.GetGroupsList();
}
