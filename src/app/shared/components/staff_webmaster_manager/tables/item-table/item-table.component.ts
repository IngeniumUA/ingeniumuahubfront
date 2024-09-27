import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {Store} from "@ngxs/store";

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

  @Input() itemTypeInput: string | null = null;
  userRoles$: Observable<UserRolesI|null> = this.store.select(state => state.user.roles);
  items$: Observable<ItemWideI[]> = of([]);

  constructor(private itemService: ItemWideService, private store: Store) {}

  ngOnInit() {
    this.items$ = this.itemService.getItems();
  }

  public GetDisplayedColumns(roles: UserRolesI): string[] {
    const displayed_columns = ['name', 'available', 'disabled', 'created_at', 'modified_at'];
    if (roles.is_manager || roles.is_webmaster) {
      displayed_columns.splice(0, 0, 'uuid'); // TODO Add 'disabled' here
    }
    return displayed_columns;
  }
}
