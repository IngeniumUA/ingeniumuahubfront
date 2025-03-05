import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {debounceTime, delay, Observable, of} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CheckoutTrackerService} from "@ingenium/app/core/services/coreAPI/checkoutTracker.service";
import {HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum} from "@ingenium/app/shared/models/tracker";
import {AsyncPipe, DatePipe, NgIf, TitleCasePipe} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-checkout-tracker-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
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
    NgIf,
    ReactiveFormsModule,
    TitleCasePipe,
    RouterLink,
    MatHeaderCellDef
  ],
  templateUrl: './checkout-tracker-page.component.html',
  styleUrl: './checkout-tracker-page.component.scss'
})
export class CheckoutTrackerPageComponent implements OnInit, OnChanges, AfterViewInit {
  constructor(private checkoutTrackerService: CheckoutTrackerService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() itemId: number | null = null;

  checkoutTrackers$: Observable<HubCheckoutTrackerI[]> = of([]);
  checkoutTrackerCount$: Observable<number> = of(0);

  pageIndex: number = 0

  searchForm = new FormGroup({
    trackerStatusControl: new FormControl(HubCheckoutTrackerStatusEnum.All),
    checkoutTrackerIdControl: new FormControl(null),
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
    return ['checkout_tracker_id', 'checkout', 'checkout_tracker_status', 'disabled', 'last_updated_timestamp', 'created_timestamp'];
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
    // Form parsing
    const trackerStatusControlValue = this.searchForm.get('trackerStatusControl')!.value;
    const checkoutTrackerIdControlValue = this.searchForm.get('checkoutTrackerIdControl')!.value;

    const trackerStatusQuery = trackerStatusControlValue === HubCheckoutTrackerStatusEnum.All ? null: trackerStatusControlValue;
    const checkoutTrackerIdQuery = checkoutTrackerIdControlValue === '' || checkoutTrackerIdControlValue === null ? null: parseInt(checkoutTrackerIdControlValue);

    // Pagination
    this.pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Query
    this.checkoutTrackers$ = this.checkoutTrackerService.getTrackers(this.pageIndex * pageSize, pageSize,
      this.itemId, trackerStatusQuery, checkoutTrackerIdQuery, "None");
    this.checkoutTrackerCount$ = this.checkoutTrackerService.getTrackerCount(this.itemId, trackerStatusQuery, checkoutTrackerIdQuery, "None");
  }

  protected readonly HubCheckoutTrackerStatusEnum = HubCheckoutTrackerStatusEnum;
}
