import {Component, Input, OnInit} from '@angular/core';
import {StaffItemService} from "../../../../../core/services/staff/items/staff_item_router";
import {StaffItemDetailI} from "../../../../models/staff/staff_item_details";
import {Observable, of} from "rxjs";
import {MatTableModule} from "@angular/material/table";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {RolesService} from "../../../../../core/services/user/roles.service";
import {HubUserRolesI} from "../../../../models/user";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  imports: [
    MatTableModule,
    NgIf,
    RouterLink,
    DatePipe,
    AsyncPipe
  ],
  standalone: true
})
export class ItemTableComponent implements OnInit {

  @Input() itemTypeInput: string | null = null
  userRoles$ = this.roleService.getRoles()
  items$: Observable<StaffItemDetailI[]> = of([])

  constructor(private itemService: StaffItemService,
              private roleService: RolesService) {
  }

  ngOnInit() {
    this.items$ = this.itemService.getItems()
  }

  public GetDisplayedColumns(roles: HubUserRolesI): string[] {
    let displayed_columns = ['name', 'available', 'disabled', 'created_at', 'modified_at']
    if (roles.is_manager || roles.is_webmaster) {
      displayed_columns.splice(0, 0, 'uuid') // TODO Add 'disabled' here
    }
    return displayed_columns
  }
}
