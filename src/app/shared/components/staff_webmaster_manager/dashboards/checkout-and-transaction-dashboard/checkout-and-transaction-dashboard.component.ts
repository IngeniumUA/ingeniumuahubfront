import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {TransactionTableComponent} from '../../tables/transaction-table/transaction-table.component';
import {CheckoutTableComponent} from '../../tables/checkout-table/checkout-table.component';
import {NgClass, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-checkout-and-transaction-dashboard',
  templateUrl: './checkout-and-transaction-dashboard.component.html',
  styleUrls: ['./checkout-and-transaction-dashboard.component.scss'],
  imports: [
    TransactionTableComponent,
    CheckoutTableComponent,
    NgIf,
    NgClass,
    NgStyle
  ],
  standalone: true
})
export class CheckoutAndTransactionDashboardComponent {

  @Input() item_id: string | null = null;
  @Input() user_id: string | null = null;
  @Input() loadDataEvent: boolean = false;

  selectedTable: string = 'checkouts';

  SetTable(table_name: string) {
    this.selectedTable = table_name;
  }

  StyleFromTablename(table_name: string) {
    if (table_name === this.selectedTable) {
      return 'table-selected';
    }
    return 'table-unselected';
  }
}
