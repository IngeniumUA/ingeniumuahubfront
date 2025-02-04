import {Component, OnInit} from '@angular/core';
import {GroupService} from "@ingenium/app/core/services/coreAPI/group.service";
import {ActivatedRoute} from "@angular/router";
import {GroupI} from "@ingenium/app/shared/models/group/hubGroupI";
import {Observable} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";
import {ToastrService} from "ngx-toastr";

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
  styleUrl: './group-detail-page.component.css'
})
export class GroupDetailPageComponent implements OnInit {
  constructor(private groupService: GroupService, private route: ActivatedRoute, private toastrService: ToastrService) {
  }

  groupId!: number;
  $groupDetail!: Observable<GroupI>;

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
}
