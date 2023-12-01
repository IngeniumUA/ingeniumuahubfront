import {Component, Input, ViewChild} from '@angular/core';
import {debounceTime, delay, Observable, of} from "rxjs";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {StaffTransactionService} from "../../../../../core/services/staff/staff-transaction.service";
import {StaffTransactionI} from "../../../../models/staff/staff_transaction";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {RouterLink} from "@angular/router";
import {TransactionStatsI} from "../../../../models/stats/transactionStats";
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ["interaction_id", "user", "count", "amount", "status", "date_completed", "date_created"]

  statusFilters: string[] = ['All', 'Successful', 'Cancelled', 'Pending', 'Failed']
  statusStats$!: Observable<TransactionStatsI>
  selectedStatus: string = 'All'

  transactionData$: Observable<StaffTransactionI[]> = of([])

  searchForm = new FormGroup({
    idControl: new FormControl(''),
    emailControl: new FormControl('')
  })

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

    // Transactions
    if (pageEvent === null) {
      this.transactionData$ = this.staffTransactionService.getTransactions(
        0, 50, this.item_id, null, status, emailControlValue, interactionIdControlValue)
    } else {
      this.paginator!.pageIndex = pageEvent.pageIndex
      this.transactionData$ = this.staffTransactionService.getTransactions(
        pageEvent.pageIndex * pageEvent.pageSize, pageEvent.pageSize, null, null, status, emailControlValue, interactionIdControlValue)
    }

    // Transactionstats
    this.statusStats$ = this.staffTransactionService.getTransactionStats(this.item_id, null)
  }

  SwitchStatusFilter(status: string) {
    this.selectedStatus = status
    this.LoadData()
  }

  StatusToStats(status: string, statsObject: TransactionStatsI): number {
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
