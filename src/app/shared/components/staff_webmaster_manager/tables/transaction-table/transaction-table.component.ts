import {Component, Input, ViewChild} from '@angular/core';
import {debounceTime, delay, Observable, of} from "rxjs";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {StaffTransactionService} from "../../../../../core/services/staff/staff-transaction.service";
import {StaffTransactionI} from "../../../../models/staff/staff_transaction";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {RouterLink} from "@angular/router";
import {StatusStatsI} from "../../../../models/stats/transactionStats";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgIf,
    RouterLink,
    NgForOf,
    NgClass,
    NgStyle,
    ReactiveFormsModule
  ],
  standalone: true
})
export class TransactionTableComponent {
  constructor(private staffTransactionService: StaffTransactionService) {
  }
  @Input() item_id: string | null = null
  @Input() user_id: string | null = null
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  statusFilters: string[] = ['All', 'Successful', 'Cancelled', 'Pending', 'Failed']
  statusStats$!: Observable<StatusStatsI>
  selectedStatus: string = 'All'

  transactionData$: Observable<StaffTransactionI[]> = of([])

  searchForm = new FormGroup({
    idControl: new FormControl(''),
    emailControl: new FormControl(''),
    productNameControl: new FormControl('')
  })

  GetDisplayedColumns(): string[] {
    let columns = ["interaction_id", "count", "amount", "status", "product", "validity", "date_completed", "date_created"]

    if (this.item_id === null) {
      columns.splice(columns.indexOf('interaction_id'), 0, 'item')
    }
    if (this.user_id === null) {
      columns.splice(columns.indexOf('interaction_id'), 0, 'user')
    }

    return columns
  }

  ngOnInit() {
    this.LoadData();
    this.searchForm.valueChanges.pipe(
      delay(500),
      distinctUntilChanged((prev, next) => prev.emailControl === next.emailControl),
      debounceTime(500)
      //combineLatest
    ).subscribe((value) => {
      this.LoadData()
      }
    )
  }

  ngAfterViewInit() {
    // Label popups are breaking something frontend related, just remove them
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.itemsPerPageLabel = '';
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
    paginatorIntl.firstPageLabel = '';
    paginatorIntl.lastPageLabel = '';
  }

  LoadData(pageEvent: PageEvent | null = null) {
    const status = this.selectedStatus === 'All' ? null: this.selectedStatus

    // Form parsing
    const emailControlValue = this.searchForm.get('emailControl')!.value;
    const interactionIdControlValue = this.searchForm.get('idControl')!.value;
    const productNameControlValue = this.searchForm.get('productNameControl')!.value;

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const interactionQuery = interactionIdControlValue === '' ? null: interactionIdControlValue;
    const productNameQuery = productNameControlValue === '' ? null: productNameControlValue;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Transaction fetching
    this.transactionData$ = this.staffTransactionService.getTransactions(
      pageIndex * pageSize, pageSize, this.item_id, this.user_id, status,
      emailQuery, interactionQuery, productNameQuery)

    // Transactionstats
    this.statusStats$ = this.staffTransactionService.getTransactionStats(this.item_id, null)
  }

  SwitchStatusFilter(status: string) {
    this.selectedStatus = status
    this.LoadData()
  }

  StatusToStats(status: string, statsObject: StatusStatsI): number {
    if (status === "All") {
      return statsObject.ALL
    }
    if (status === "Successful") {
      return statsObject.SUCCESSFUL
    }
    if (status === "Failed") {
      return statsObject.FAILED
    }
    if (status === "Cancelled") {
      return statsObject.CANCELLED
    }
    if (status === "Pending") {
      return statsObject.PENDING
    }
    return 0
  }

  StyleClassFromStatus(status: string): string {
    if (status === "SUCCESSFUL") {
      return 'SUCCESSFUL-text'
    } else if (status === "PENDING") {
      return 'PENDING-text'
    } else if (status === "CANCELLED") {
      return 'CANCELLED-text'
    } else if (status === "FAILED") {
      return 'FAILED-text'
    }
    return ""
  }
}
