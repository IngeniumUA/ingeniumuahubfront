import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {UserI} from '../../../../models/staff/staff_user_detail';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HubGroupI} from '../../../../models/staff/HubGroup';
import {StaffGroupService} from '../../../../../core/services/staff/group/staff-group.service';
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

  constructor(private staffGroupService: StaffGroupService) {
  }

  @Input() userDetail!: UserI;
  @Output() refetchUserEvent = new EventEmitter<boolean>();

  $groups: Observable<HubGroupI[]> = this.staffGroupService.GetGroupsList();
  groupControl = new FormControl<string>('');

  AddToGroup() {
    if (this.groupControl.value === null) {
      return;
    }
    this.staffGroupService.AddUserToGroup(this.groupControl.value, this.userDetail.uuid).subscribe({
      next: () => {
        this.refetchUserEvent.emit(true);
      },
      error: () => {
        // TODO Show error
      }
    });
  }

  RemoveFromGroup(group_id: number) {
    this.staffGroupService.RemoveUserFromGroup(group_id, this.userDetail.uuid).subscribe({
      next: () => {
        this.refetchUserEvent.emit(true);
      },
      error: () => {
        // TODO Show error
      }
    });
  }
}
