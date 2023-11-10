import {Component, Input, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {StaffUserDetailI} from "../../../../models/staff/staff_user_detail";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {StaffTransactionService} from "../../../../../core/services/staff/staff-transaction.service";
import {StaffTransactionI} from "../../../../models/staff/staff_transaction";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-transaction-table',
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css'],
  imports: [
    AsyncPipe,
    DatePipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgIf,
    RouterLink
  ],
  standalone: true
})
export class TransactionTableComponent {
  displayedColumns = ["interaction_id", "user_id", "status"]

  transactionData$: Observable<StaffTransactionI[]> = of([])

  @Input() item_id: string | undefined = undefined

  constructor(private staffTransactionTable: StaffTransactionService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.LoadData()
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

  LoadData(event: PageEvent | null = null) {
    if (event === null) {
      this.transactionData$ = this.staffTransactionTable.getTransactions(0, 50, this.item_id)
      return
    }
    this.paginator!.pageIndex = event.pageIndex
    this.transactionData$ = this.staffTransactionTable.getTransactions(event.pageIndex * event.pageSize, event.pageSize)
  }

}
