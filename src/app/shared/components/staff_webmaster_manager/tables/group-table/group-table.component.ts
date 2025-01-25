import {AfterViewInit, Component, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {GroupService} from '@ingenium/app/core/services/coreAPI/group.service';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {debounceTime, delay, Observable, of} from 'rxjs';
import {CurrencyPipe} from "@ingenium/app/shared/pipes/currency.pipe";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {GroupI} from "@ingenium/app/shared/models/group/hubGroupI";

@Component({
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.scss'],
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatTable,
    ReactiveFormsModule,
    MatHeaderCellDef
  ],
  standalone: true
})
export class GroupTableComponent implements OnInit, OnChanges, AfterViewInit {
  constructor(private groupService: GroupService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  groups$: Observable<GroupI[]> = of([]);
  groupCount$: Observable<number> = this.groupService.getGroupCount();

  pageIndex: number = 0
  blob!: Blob;

  searchForm = new FormGroup({
    idControl: new FormControl(''),
    groupNameControl: new FormControl(''),
  });

  ngOnChanges(changes: SimpleChanges) {
    const loadData: SimpleChange = changes['loadDataEvent'];
    if (loadData.previousValue !== loadData.currentValue) {
      // When previous value was 'loading' and now 'loading' has switched off
      // Then we can reload our own data as well
      this.LoadData();
    }
  }

  GetDisplayedColumns(): string[] {
    return ['id', 'name', 'academic_year', 'keycloak_group_uuid', 'last_update_timestamp', 'created_timestamp', 'user_count'];
  }

  ngOnInit() {
    this.LoadData();
    this.searchForm.valueChanges.pipe(
      delay(500),
      debounceTime(500)
      //combineLatest
    ).subscribe(() => {
        this.LoadData();
      }
    );
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

  LoadData(pageEvent: PageEvent | null = null) {
    this.pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    this.groups$ = this.groupService.getGroupTable(this.pageIndex * pageSize, pageSize);
    this.groupCount$ = this.groupService.getGroupCount();
  }
}
