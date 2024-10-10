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
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {debounceTime, delay, Observable, of} from 'rxjs';
import {StatusStatsI} from '../../../../models/stats/transactionStats';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {StaffCheckoutService} from '../../../../../core/services/staff/staff-checkout.service';
import {StaffCheckoutI, StaffCheckoutPatchI} from '../../../../models/staff/staff_checkout';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {CurrencyPipe} from '../../../../pipes/currency.pipe';

@Component({
  selector: 'app-checkout-table',
  templateUrl: './checkout-table.component.html',
  styleUrls: ['./checkout-table.component.scss'],
  imports: [
    AsyncPipe,
    DatePipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    CurrencyPipe
  ],
  standalone: true
})
export class CheckoutTableComponent implements OnChanges, OnInit, AfterViewInit {

  constructor(private staffCheckoutService: StaffCheckoutService) {
  }
  @Input() user_id: string | null = null;
  @Input() item_id: number | null = null;
  @Input() loadDataEvent: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  statusFilters: string[] = ['All', 'Successful', 'Cancelled', 'Pending', 'Failed'];
  statusStats$!: Observable<StatusStatsI>;
  selectedStatus: string = 'All';

  checkoutData$: Observable<StaffCheckoutI[]> = of([]);

  searchForm = new FormGroup({
    idControl: new FormControl(''),
    emailControl: new FormControl('')
  });

  GetDisplayedColumns(): string[] {
    const columns = ['checkout_id', 'amount', 'status', 'payment_providor', 'date_completed', 'date_created'];

    if (this.user_id === null) {
      columns.splice(columns.indexOf('amount'), 0, 'user');
    }

    return columns;
  }

  ngOnChanges(changes: SimpleChanges) {
    const loadData: SimpleChange = changes['loadDataEvent'];
    if (loadData.previousValue && !loadData.currentValue) {
      // When previous value was 'loading' and now 'loading' has switched off
      // Then we can reload our own data as well
      this.LoadData();
    }
  }

  ngOnInit() {
    this.LoadData();
    this.searchForm.valueChanges.pipe(
      delay(500),
      distinctUntilChanged((prev, next) => prev.emailControl === next.emailControl),
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
    const status = this.selectedStatus === 'All' ? null: this.selectedStatus;

    // Form parsing
    const emailControlValue = this.searchForm.get('emailControl')!.value;
    const checkoutIdControlValue = this.searchForm.get('idControl')!.value;

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const checkoutIdQuery = checkoutIdControlValue === '' ? null: checkoutIdControlValue;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Transaction fetching
    this.checkoutData$ = this.staffCheckoutService.getCheckouts(
      pageIndex * pageSize, pageSize, this.item_id, this.user_id, status,
      emailQuery, checkoutIdQuery);

    // Transactionstats
    this.statusStats$ = this.staffCheckoutService.getCheckoutStats(this.item_id, this.user_id);
  }

  SwitchStatusFilter(status: string) {
    this.selectedStatus = status;
    this.LoadData();
  }

  StatusToStats(status: string, statsObject: StatusStatsI): number {
    if (status === 'All') {
      return statsObject.ALL;
    }
    if (status === 'Successful') {
      return statsObject.SUCCESSFUL;
    }
    if (status === 'Failed') {
      return statsObject.FAILED;
    }
    if (status === 'Cancelled' || status === 'Refunded') {
      return statsObject.CANCELLED;
    }
    if (status === 'Pending' || status === 'Refund_pending') {
      return statsObject.PENDING;
    }
    return 0;
  }

  StyleClassFromStatus(status: string): string {
    if (status === 'SUCCESSFUL') {
      return 'SUCCESSFUL-text';
    } else if (status === 'PENDING' || status === 'REFUND_PENDING') {
      return 'PENDING-text';
    } else if (status === 'CANCELLED' || status === 'REFUNDED') {
      return 'CANCELLED-text';
    } else if (status === 'FAILED') {
      return 'FAILED-text';
    }
    return '';
  }

  CancelCheckout(checkout_id: string) {
    const patchObj: StaffCheckoutPatchI = {
      status: 'CANCELLED'
    };
    this.staffCheckoutService.patchCheckout(checkout_id, patchObj).subscribe({
      next: () => {
        // Refetch data on complete
        // This could replace the specific checkout in data
        // But it would be a bit harder because we subscribe to the data in template
        this.LoadData();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
