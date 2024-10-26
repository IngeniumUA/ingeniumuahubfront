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
import {AsyncPipe, DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {CurrencyPipe} from '../../../../pipes/currency.pipe';
import {CheckoutI, CheckoutPatchI} from "@ingenium/app/shared/models/checkout/checkoutModels";
import {CheckoutService} from "@ingenium/app/core/services/coreAPI/checkout/checkout.service";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {PaymentProviderEnum} from "@ingenium/app/shared/models/items/products/products";

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
    CurrencyPipe,
    KeyValuePipe,
    TitleCasePipe
  ],
  standalone: true
})
export class CheckoutTableComponent implements OnChanges, OnInit, AfterViewInit {

  constructor(private checkoutService: CheckoutService) {
  }
  @Input() user_id: string | null = null;
  @Input() item_id: number | null = null;
  @Input() loadDataEvent: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  statusColumns = [
    PaymentStatusEnum.all,
    PaymentStatusEnum.successful,
    PaymentStatusEnum.cancelled,
    PaymentStatusEnum.failed,
    PaymentStatusEnum.pending,
    PaymentStatusEnum.refunded,
  ]
  statusStats$!: Observable<StatusStatsI>;
  selectedStatus: number | PaymentStatusEnum = 0;

  checkoutData$: Observable<CheckoutI[]> = of([]);

  searchForm = new FormGroup({
    idControl: new FormControl(''),
    emailControl: new FormControl('')
  });

  GetDisplayedColumns(): string[] {
    const columns = ['checkout_uuid', 'amount', 'status', 'payment_provider', 'completed_timestamp', 'created_timestamp'];

    // Don't display user column if user is input into this component
    // For example when viewing all checkouts for a user
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
    const status = this.selectedStatus === 0 ? null: this.selectedStatus;

    // Form parsing
    const emailControlValue = this.searchForm.get('emailControl')!.value;
    const checkoutIdControlValue = this.searchForm.get('idControl')!.value;

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const checkoutIdQuery = checkoutIdControlValue === '' ? null: checkoutIdControlValue;

    // User
    const userQuery = this.user_id !== null ? this.user_id : emailQuery;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Transaction fetching
    this.checkoutData$ = this.checkoutService.queryCheckouts(
      pageIndex * pageSize, pageSize, this.item_id, userQuery, status,
      checkoutIdQuery);

    // Transactionstats
    this.statusStats$ = this.checkoutService.checkoutCountGroupByStatus(this.item_id, this.user_id);
  }

  SwitchStatusFilter(status: number) {
    this.selectedStatus = status;
    this.LoadData();
  }

  StatusToStats(status: number, statsObject: StatusStatsI): number {
    if (status === 0) {  // '0' is all
      return statsObject[PaymentStatusEnum.all];
    }
    else if (status === PaymentStatusEnum.successful) {
      return statsObject[PaymentStatusEnum.successful];
    }
    else if (status === PaymentStatusEnum.failed) {
      return statsObject[PaymentStatusEnum.failed];
    }
    else if (status === PaymentStatusEnum.cancelled
      || status === PaymentStatusEnum.refunded
      || status === PaymentStatusEnum.partially_refunded) {
      return statsObject[PaymentStatusEnum.cancelled] + statsObject[PaymentStatusEnum.refunded] + statsObject[PaymentStatusEnum.partially_refunded];
    }
    else if (status === PaymentStatusEnum.pending  || status === PaymentStatusEnum.refund_pending) {
      return statsObject[PaymentStatusEnum.pending] + statsObject[PaymentStatusEnum.refund_pending];
    }
    return 0;
  }

  StyleClassFromStatus(status: number): string {
    if (status === PaymentStatusEnum.successful) {
      return 'SUCCESSFUL-text';
    } else if (status === PaymentStatusEnum.pending || status === PaymentStatusEnum.refund_pending) {
      return 'PENDING-text';
    } else if (status === PaymentStatusEnum.cancelled
      || status === PaymentStatusEnum.refunded
      || status === PaymentStatusEnum.partially_refunded) {
      return 'CANCELLED-text';
    } else if (status === PaymentStatusEnum.failed) {
      return 'FAILED-text';
    }
    return '';
  }

  CancelCheckout(checkout_uuid: string) {
    const patchObj: CheckoutPatchI = {
      checkout_status: PaymentStatusEnum.cancelled
    };
    this.checkoutService.patchCheckout(checkout_uuid, patchObj).subscribe({
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

  protected readonly PaymentStatusEnum = PaymentStatusEnum;
  protected readonly PaymentProviderEnum = PaymentProviderEnum;
}
