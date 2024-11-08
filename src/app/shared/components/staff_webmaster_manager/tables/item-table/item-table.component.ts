import {Component, Input, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {Store} from "@ngxs/store";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  imports: [
    MatTableModule,
    NgIf,
    DatePipe,
    AsyncPipe
  ],
  standalone: true
})
export class ItemTableComponent implements OnInit {

  @Input() itemTypeInput: string | null = null;
  userRoles$: Observable<UserRolesI|null> = this.store.select(state => state.user.roles);
  items$: Observable<ItemI[]> = of([]);

  constructor(private itemService: ItemService,
              private store: Store,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,) {
  }

  ngOnInit() {
    this.items$ = this.itemService.getItems();
  }

  public GetDisplayedColumns(roles: UserRolesI): string[] {
    const displayed_columns = ['name', 'available', 'disabled', 'created_at', 'modified_at'];
    if (roles.is_manager || roles.is_webmaster) {
      displayed_columns.splice(0, 0, 'id'); // TODO Add 'disabled' here
    }
    return displayed_columns;
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }
}
