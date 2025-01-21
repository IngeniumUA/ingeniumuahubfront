import {Component, Input} from '@angular/core';
import {TransactionTableComponent} from '../../tables/transaction-table/transaction-table.component';
import {CheckoutTableComponent} from '../../tables/checkout-table/checkout-table.component';
import {NgClass} from '@angular/common';
import {
  CreateCheckoutComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/create/create-checkout/create-checkout.component";

@Component({
    selector: 'app-checkout-and-transaction-dashboard',
    templateUrl: './checkout-and-transaction-dashboard.component.html',
    styleUrls: ['./checkout-and-transaction-dashboard.component.scss'],
    imports: [
        TransactionTableComponent,
        CheckoutTableComponent,
        NgClass,
        CreateCheckoutComponent
    ]
})
export class CheckoutAndTransactionDashboardComponent {

  @Input() item_id: number | null = null;
  @Input() user_id: string | null = null;
  @Input() loadDataEvent: boolean = false;

  selectedTable: string = 'checkouts';
  addingCheckout: boolean = false;

  SetTable(table_name: string) {
    this.selectedTable = table_name;
  }

  StyleFromTablename(table_name: string) {
    if (table_name === this.selectedTable) {
      return 'table-selected';
    }
    return 'table-unselected';
  }

  refetchTable(_reload: boolean) {
    this.ToggleAddingCheckout();
  }

  ToggleAddingCheckout() {
    this.addingCheckout = !this.addingCheckout;
  }
}
