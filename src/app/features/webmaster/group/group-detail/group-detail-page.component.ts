import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GroupService} from "@ingenium/app/core/services/coreAPI/group.service";
import {ActivatedRoute} from "@angular/router";
import {GroupI} from "@ingenium/app/shared/models/group/hubGroupI";
import {Observable, of, switchMap} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";
import {ToastrService} from "ngx-toastr";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";
import {KeycloakService} from "@ingenium/app/core/services/coreAPI/keycloak.service";

@Component({
  selector: 'app-group-detail-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    DatePipe
  ],
  templateUrl: './group-detail-page.component.html',
  styleUrl: './group-detail-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailPageComponent implements OnInit {
  constructor(private groupService: GroupService, private route: ActivatedRoute,
              private toastrService: ToastrService, private store: Store,
              protected keycloakService: KeycloakService) {
    this.roles$ = this.store.select(UserState.roles);
  }

  roles$: Observable<UserRolesI|null>;

  groupId!: number;
  $groupDetail!: Observable<GroupI>;

  groupMembersCount$!: Observable<number>;
  keycloakGroupMembersCount$!: Observable<number>;

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.toastrService.success("ID is null");
      return;
    }
    this.groupId = Number(id);
    this.loadData();
  }

  loadData(): void {
    this.$groupDetail = this.groupService.getGroup(this.groupId);
    this.groupMembersCount$ = this.groupService.getGroupMemberCount(this.groupId);
    this.keycloakGroupMembersCount$ = this.$groupDetail.pipe(
      switchMap((groupI) => {
        // Perform the second request using the result of the first
        if (groupI.keycloak_group_uuid === null) { return of(0); }
        return this.keycloakService.getGroupMemberCount(groupI.keycloak_group_uuid);
      })
    );
  }

  groupPatchForm = new FormGroup({
    keycloakUuidControl: new FormControl("", Validators.required)
  })

  patchGroup() {
    const keycloak_uuid = this.groupPatchForm.get('keycloakUuidControl')!.value;
    const patchObj ={
      keycloak_group_uuid: keycloak_uuid
    }
    const patchObjNoNull = removeNull(patchObj)

    this.groupService.patchGroup(this.groupId, patchObjNoNull).subscribe(
      {
        next: () => {
          this.toastrService.success("Group patch successful");
          this.loadData();
        },
        error: (error: any) => {
          this.toastrService.error(error.message);
        }
      }
    )
  }


  syncWithKeycloak() {
    this.groupService.syncMembersWithKeycloak(this.groupId).subscribe(
        {
          next: () => {
            this.toastrService.success("Synced Successfully");
            this.loadData();
          },
          error: (error: any) => {
            this.toastrService.error(error.message);
          }
        }
    )
  }
}
