import {Component, Input} from '@angular/core';
import {TransactionI} from '../../../../core/services/user/account/account.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
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

  @Input() transaction!: TransactionI;

}
