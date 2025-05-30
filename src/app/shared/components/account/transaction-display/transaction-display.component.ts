import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {TransactionLimitedI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
@Component({
  selector: 'app-transaction-display',
  templateUrl: './transaction-display.component.html',
  styleUrls: ['./transaction-display.component.scss'],
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class TransactionDisplayComponent {

  @Input() transaction!: TransactionLimitedI;

}
