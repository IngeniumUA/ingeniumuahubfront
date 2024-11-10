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
import {debounceTime, delay, Observable, of} from 'rxjs';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {AsyncPipe, DatePipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle, TitleCasePipe} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {StatusStatsI} from '../../../../models/stats/transactionStats';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {CurrencyPipe} from '../../../../pipes/currency.pipe';
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {TransactionService} from "@ingenium/app/core/services/coreAPI/payment/transaction.service";
import {TransactionI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {ValidityEnum, ValidityList} from "@ingenium/app/shared/models/payment/transaction/validityEnum";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {RouterLink} from "@angular/router";

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
    NgForOf,
    NgClass,
    NgStyle,
    ReactiveFormsModule,
    CurrencyPipe,
    KeyValuePipe,
    TitleCasePipe,
    RouterLink
  ],
  standalone: true
})
export class TransactionTableComponent implements AfterViewInit, OnChanges, OnInit {
  constructor(private transactionService: TransactionService,
              private datePipe: DatePipe,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,) {
  }
  @Input() item_id: number | null = null;
  @Input() user_id: string | null = null;
  @Input() checkout_id: string | null = null;
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

  transactionData$: Observable<TransactionI[]> = of([]);

  pageIndex: number = 0
  blob!: Blob;

  searchForm = new FormGroup({
    idControl: new FormControl(''),
    emailControl: new FormControl(''),
    pricePolicyNameControl: new FormControl(''),
    productNameControl: new FormControl(''),
    validityControl: new FormControl('')
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
    const columns = ['interaction_id', 'amount', 'product_blueprint', 'price_policy', 'status', 'validity', 'completed_timestamp', 'created_timestamp'];

    // Add if not Input()
    if (this.item_id === null) {
      columns.splice(columns.indexOf('interaction_id'), 0, 'item');
    }
    if (this.user_id === null) {
      columns.splice(columns.indexOf('interaction_id'), 0, 'user');
    }
    if (this.checkout_id === null) {
      columns.splice(0, 0, 'checkout_uuid');
    }

    return columns;
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
    const interactionIdControlValue = this.searchForm.get('idControl')!.value;
    const productNameControlValue = this.searchForm.get('productNameControl')!.value;
    const pricePolicyNameControlValue = this.searchForm.get('pricePolicyNameControl')!.value;
    const validityControlValue = this.searchForm.get('validityControl')!.value;

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const interactionQuery = interactionIdControlValue === '' || interactionIdControlValue === null ? null: parseInt(interactionIdControlValue);
    const productNameQuery = productNameControlValue === '' ? null: productNameControlValue;
    const validityQuery = validityControlValue === '' || validityControlValue === null ? null: parseInt(validityControlValue);
    const pricePolicyQuery = pricePolicyNameControlValue === '' ? null: pricePolicyNameControlValue;

    // User
    const userQuery = this.user_id !== null ? this.user_id : emailQuery;

    // Page behaviour
    this.pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Transaction fetching
    this.transactionData$ = this.transactionService.queryTransactions(
      this.pageIndex * pageSize, pageSize,
      this.item_id, userQuery, interactionQuery,
      status,
      validityQuery,
      this.checkout_id, null,
      productNameQuery,
      null,
      pricePolicyQuery);

    // Transactionstats
    this.statusStats$ = this.transactionService.transactionCountGroupByStatus(
      this.item_id, this.user_id, interactionQuery,
      status,
      validityQuery,
      this.checkout_id, null,
      productNameQuery,
      null,
      null);
  }

  SwitchStatusFilter(status: number) {
    this.selectedStatus = status;
    this.LoadData();
  }

  StatusToStats(status: number, statsObject: StatusStatsI): number {
    if (status === 0) {  // '0' is all
      return statsObject["0"];
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

  StyleClassFromValidity(validity: number): string {
    if (validity === ValidityEnum.valid) {
      return 'SUCCESSFUL-text';
    } else if (validity === ValidityEnum.invalid) {
      return 'PENDING-text';
    } else if (validity === ValidityEnum.consumed) {
      return 'CANCELLED-text';
    } else if (validity === ValidityEnum.manually_verified) {
      return 'CANCELLED-text';
    } else if (validity === ValidityEnum.forbidden) {
      return 'FAILED-text';
    }
    return '';
  }

  DownloadData() {
    const status = this.selectedStatus === 0 ? null: this.selectedStatus;

    // Form parsing
    // const emailControlValue = this.searchForm.get('emailControl')!.value;
    const interactionIdControlValue = this.searchForm.get('idControl')!.value;
    const productNameControlValue = this.searchForm.get('productNameControl')!.value;
    const validityControlValue = this.searchForm.get('validityControl')!.value;

    // const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const interactionQuery = interactionIdControlValue === '' || interactionIdControlValue === null ? null: parseInt(interactionIdControlValue);
    const productNameQuery = productNameControlValue === '' ? null: productNameControlValue;
    const validityQuery = validityControlValue === '' || validityControlValue === null ? null: parseInt(validityControlValue);

    // const fields: string[] = ['id', 'user_email', 'item_name', 'user_voornaam', 'user_achternaam',
    // 'product_id', 'product_name', 'amount', 'transaction_status',
    //   'date_created', 'date_completed', 'validity', 'currency', 'payment_provider']

    this.transactionService.getTransactionsExport(this.item_id, this.user_id, interactionQuery,
      status,
      validityQuery,
      null, null,
      productNameQuery,
      null,
      null).subscribe((data) => {
      const date = new Date();
      const pipedDate = this.datePipe.transform(date, 'dd-MM-yyyy');


      this.blob = new Blob([data], {type: 'application/vnd.ms-excel'});

      const downloadURL = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'TransactionExport_' + pipedDate + '.xlsx';
      link.click();

      // This took me longer than I would like to admit
      // These two answers hold all the answers
      // https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
      // https://stackoverflow.com/questions/60730934/typescript-http-get-error-no-overload-matches-this-call
    });
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

  protected readonly PaymentStatusEnum = PaymentStatusEnum;
  protected readonly ValidityEnum = ValidityEnum;
  protected readonly ValidityList = ValidityList;
}
