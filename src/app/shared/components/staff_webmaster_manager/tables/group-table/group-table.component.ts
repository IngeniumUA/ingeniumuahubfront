import { Component } from '@angular/core';
import {StaffGroupService} from '../../../../../core/services/staff/group/staff-group.service';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {HubGroupI} from '../../../../models/staff/HubGroup';

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
  constructor(private staffGroupService: StaffGroupService) {
  }

  groups$: Observable<HubGroupI[]> = this.staffGroupService.GetGroupsList();
}
