import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';
import { UserWideI} from '../../../../models/user/userI';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {GroupI} from '../../../../models/group/HubGroup';
import {GroupService} from '@ingenium/app/core/services/coreAPI/group/group.service';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-staff-user-detail',
  templateUrl: './staff-user-detail.component.html',
  styleUrls: ['./staff-user-detail.component.css'],
  imports: [
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    AsyncPipe,
    MatTableModule,
    DatePipe
  ],
  standalone: true
})
export class StaffUserDetailComponent {

  constructor(private groupService: GroupService) {
  }

  @Input() userDetail!: UserWideI;
  @Output() refetchUserEvent = new EventEmitter<boolean>();

  $groups: Observable<GroupI[]> = this.groupService.GetGroupsList(null, null);
  groupControl = new FormControl<string>('');

  AddToGroup() {
    if (this.groupControl.value === null) {
      return;
    }
    this.groupService.AddUserToGroup(this.groupControl.value, this.userDetail.user_uuid).subscribe({
      next: () => {
        this.refetchUserEvent.emit(true);
      },
      error: () => {
        // TODO Show error
      }
    });
  }

  RemoveFromGroup(group_id: number) {
    this.groupService.RemoveUserFromGroup(group_id, this.userDetail.user_uuid).subscribe({
      next: () => {
        this.refetchUserEvent.emit(true);
      },
      error: () => {
        // TODO Show error
      }
    });
  }
}
