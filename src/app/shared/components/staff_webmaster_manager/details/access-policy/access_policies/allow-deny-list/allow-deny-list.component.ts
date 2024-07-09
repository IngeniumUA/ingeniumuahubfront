import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {FormArray, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AllowDenyListI} from '../../../../../../models/access_policies/access_policies';
import {Observable} from "rxjs";
import {HubGroupI} from "@ingenium/app/shared/models/staff/HubGroup";
import {StaffGroupService} from "@ingenium/app/core/services/staff/group/staff-group.service";

@Component({
  selector: 'app-allow-deny-list',
  templateUrl: './allow-deny-list.component.html',
  styleUrls: ['./allow-deny-list.component.css'],
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class AllowDenyListComponent implements OnInit {

    @Input() access_policy_content!: {[index: string]:any};
    @Input() access_policy_method: string | undefined;
    @Output() UpdateAccessPolicy = new EventEmitter<AllowDenyListI>;

  groups$: Observable<HubGroupI[]> = this.staffGroupService.GetGroupsList();

    parsedPolicyContent!: AllowDenyListI;

    whitelistGroupsForm: FormArray<FormControl> = new FormArray<FormControl>([]);
    blacklistGroupsForm: FormArray<FormControl> = new FormArray<FormControl>([]);

    constructor(private staffGroupService: StaffGroupService) {
    }

    ngOnInit() {
      // Parse content as correct interface ( allows for typehints )
      this.parsedPolicyContent = {
        whitelist: this.access_policy_content['whitelist'],
        blacklist: this.access_policy_content['blacklist'],
      };
      // Adding existing groups to forms
      if (this.parsedPolicyContent.whitelist !== null && this.parsedPolicyContent.whitelist !== undefined) {
        for (const whitelistedGroup of this.parsedPolicyContent.whitelist) {
          this.whitelistGroupsForm.push(new FormControl(whitelistedGroup, Validators.min(0)));
        }
      }
      if (this.parsedPolicyContent.blacklist !== null && this.parsedPolicyContent.blacklist !== undefined) {
        for (const blacklistedGroup of this.parsedPolicyContent.blacklist) {
          this.blacklistGroupsForm.push(new FormControl(blacklistedGroup, Validators.min(0)));
        }
      }

      // Update button is on parent component.
      // Each time this form is updated we emit 'valuechange' to parent
      this.whitelistGroupsForm.valueChanges.subscribe(_ => {
        this.ValueChange();
      });
      // Pretty ugly code duplication
      this.blacklistGroupsForm.valueChanges.subscribe(_ => {
        this.ValueChange();
      });
    }

    AddGroupField(blacklist: boolean) {
      if (blacklist) {
        this.blacklistGroupsForm.push(new FormControl(0, Validators.min(0)));
      } else {
        this.whitelistGroupsForm.push(new FormControl(0, Validators.min(0)));
      }
      this.ValueChange();
    }

    RemoveGroup(blacklist: boolean, index: number) {
      if (blacklist) {
        this.blacklistGroupsForm.removeAt(index);
      } else {
        this.whitelistGroupsForm.removeAt(index);
      }
      this.ValueChange();
    }

    ValueChange() {
      if (!(this.blacklistGroupsForm.length > 0)) {
        this.parsedPolicyContent.blacklist = null;
      } else {
        const blacklist: number[] = [];
        for (let i =0;i< this.blacklistGroupsForm.length;i++) {
          const element = this.blacklistGroupsForm.at(i);
          if (element.valid) {
            blacklist.push(element.value);
          }
        }
        this.parsedPolicyContent.blacklist = blacklist;
      }
      if (!(this.whitelistGroupsForm.length > 0)) {
        this.parsedPolicyContent.whitelist = null;
      } else {
        const whitelist: number[] = [];
        for (let i =0;i< this.whitelistGroupsForm.length;i++) {
          const element = this.whitelistGroupsForm.at(i);
          if (element.valid) {
            whitelist.push(element.value);
          }
        }
        this.parsedPolicyContent.whitelist = whitelist;
      }
      this.UpdateAccessPolicy.emit(this.parsedPolicyContent);
    }
}
