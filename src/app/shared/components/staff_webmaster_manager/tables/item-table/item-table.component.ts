import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";
import {Store} from "@ngxs/store";
import {ItemI, ItemTypeEnum, ItemTypeList} from "@ingenium/app/shared/models/item/itemI";
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  imports: [
    MatTableModule,
    NgIf,
    RouterLink,
    DatePipe,
    AsyncPipe,
    MatPaginator,
    MatProgressSpinner,
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  standalone: true
})
export class ItemTableComponent implements OnInit, AfterViewInit {

  @Input() itemTypeInput: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageIndex: number = 0

  items$: Observable<ItemI[]> = of([]);
  itemCount$ = of(0);

  searchForm = new FormGroup({
    itemTypesControl: new FormArray<FormControl>([])
  });

  constructor(private itemService: ItemService, private store: Store) {}

  ngOnInit() {
    this.LoadData(null);
  }

  LoadData(pageEvent: PageEvent | null = null) {
    // Item type query
    const itemTypeControls = this.searchForm.controls['itemTypesControl'];
    const itemTypeControlValues = itemTypeControls.controls.map((control) => {return control.value;});

    // Page behaviour
    this.pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 50: pageEvent.pageSize;

    // Query Items and Count
    this.items$ = this.itemService.queryItems(this.pageIndex * pageSize, pageSize, itemTypeControlValues);
    this.itemCount$ = this.itemService.countItems(itemTypeControlValues);
  }

  public GetDisplayedColumns(): string[] {
    const displayed_columns = ['name', 'available', 'disabled', 'created_at', 'modified_at'];

    const roles: UserRolesI = this.store.selectSnapshot(state => state.user.roles)
    if (roles.is_manager || roles.is_webmaster) {
      displayed_columns.splice(0, 0, 'id'); // TODO Add 'disabled' here
    }
    return displayed_columns;
  }

  ngAfterViewInit() {
    // Label popups are breaking something frontend related, just remove them
    // In some cases the paginator is undefined ? We check if it is defined
    if (this.paginator === undefined) {
      return;
    }
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.itemsPerPageLabel = '';
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
    paginatorIntl.firstPageLabel = '';
    paginatorIntl.lastPageLabel = '';
  }

  AddItemTypeField() {
    this.searchForm.controls['itemTypesControl'].push(new FormControl(0));
  }

  RemoveItemTypeField(index: number) {
    this.searchForm.controls['itemTypesControl'].removeAt(index);
  }

  protected readonly ItemTypeList = ItemTypeList;
  protected readonly ItemTypeEnum = ItemTypeEnum;
}
