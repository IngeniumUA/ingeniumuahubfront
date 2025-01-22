import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';
import { UserWideI} from '../../../../models/user/userI';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GroupI} from '../../../../models/group/hubGroupI';
import {GroupService} from '@ingenium/app/core/services/coreAPI/group.service';
import {MatTableModule} from '@angular/material/table';
import {UserService} from "@ingenium/app/core/services/coreAPI/user/user.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
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
export class UserDetailComponent {

  constructor(private groupService: GroupService,
              private userService: UserService) {
  }

  @Input() userDetail!: UserWideI;
  @Output() refetchUserEvent = new EventEmitter<boolean>();

  $groups: Observable<GroupI[]> = this.groupService.GetGroupsList(null, null);
  groupControl = new FormControl<string>('');

  userPatchForm = new FormGroup({
    ssoUuidControl: new FormControl("", Validators.required)
  })

  patchUser() {
    const sso_uuid = this.userPatchForm.get('ssoUuidControl')!.value;
    if (sso_uuid === null) {
      return
    }
    const patch_obj ={
      sso_uuid: sso_uuid
    }
    this.userService.patchWide(this.userDetail.user_uuid, patch_obj).subscribe(
      {
        next: () => {
          this.refetchUserEvent.emit(true);
        },
        error: (error: any) => {
          console.log(error);
        }
      }
    )
  }

  syncWithKeycloak() {
    this.userService.syncWithKeycloak(this.userDetail.user_uuid).subscribe()
  }

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
