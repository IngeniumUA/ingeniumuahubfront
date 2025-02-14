import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {debounceTime, delay, Observable, of} from "rxjs";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InteractionI} from "@ingenium/app/shared/models/interaction/hubInteractionI";
import {InteractionService} from "@ingenium/app/core/services/coreAPI/interaction.service";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";
import {InteractionTypeEnum} from "@ingenium/app/shared/models/interaction/interactionTypeEnum";

@Component({
  selector: 'app-interaction-table',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatPaginator,
    MatTable,
    NgIf,
    ReactiveFormsModule,
    MatProgressSpinner,
    RouterLink,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatHeaderCellDef,
    DatePipe
  ],
  templateUrl: './interaction-table.component.html',
  styleUrl: './interaction-table.component.scss'
})
export class InteractionTableComponent implements AfterViewInit, OnInit {
  constructor(private interactionService: InteractionService) {
  }

  @Input() item_id: number | null = null;
  @Input() user_id: string | null = null;
  @Input() loadDataEvent: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  interactionData$: Observable<InteractionI[]> = of([])
  interactionCount$: Observable<number> = of(0)

  GetDisplayedColumns(): string[] {
    const columns = ['interaction_id', 'interaction_type', 'last_updated_timestamp', 'created_timestamp'];

    // Add if not Input()
    if (this.item_id === null) {
      columns.splice(columns.indexOf('interaction_type'), 0, 'item');
    }
    if (this.user_id === null) {
      columns.splice(columns.indexOf('interaction_type'), 0, 'user');
    }
    return columns
  }

  pageIndex: number = 0;
  columnSearchForm = new FormGroup({
    idControl: new FormControl(''),
    userControl: new FormControl(''),
    itemControl: new FormControl(''),
    interactionTypeControl: new FormControl('')
  });

  ngOnInit() {
    this.LoadData();
    this.columnSearchForm.valueChanges.pipe(
      delay(500),
      debounceTime(500)
      //combineLatest
    ).subscribe(() => {
        this.LoadData();
      }
    );
  }

  LoadData(pageEvent: PageEvent | null = null) {
    // Page behaviour
    this.pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Parse form
    const interactionControlValue = this.columnSearchForm.get('idControl')!.value;
    const interactionQuery = interactionControlValue === '' ? null: interactionControlValue;

    const itemControlValue = this.columnSearchForm.get('itemControl')!.value;
    const itemQuery = itemControlValue === '' ? null: itemControlValue;

    const userControlValue = this.columnSearchForm.get('userControl')!.value;
    const userQuery = userControlValue === '' ? null: userControlValue;

    // Interaction fetching
    this.interactionData$ = this.interactionService.queryInteractions(
      this.pageIndex * pageSize, pageSize, null, interactionQuery,
      this.user_id, this.item_id, itemQuery, userQuery);

    // Interaction
    this.interactionCount$ = this.interactionService.getInteractionCount(
      null, interactionQuery, this.user_id, this.item_id, itemQuery, userQuery)
  }

  DownloadData() {

  }

  // ngOnChanges(changes: SimpleChanges) {
  //   const loadData: SimpleChange = changes['loadDataEvent'];
  //   if (loadData.previousValue !== loadData.currentValue) {
  //     // When previous value was 'loading' and now 'loading' has switched off
  //     // Then we can reload our own data as well
  //     this.LoadData();
  //   }
  // }

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

  protected readonly InteractionTypeEnum = InteractionTypeEnum;
}
