import {Component, Input} from '@angular/core';
import {TransactionI} from "../../../../core/services/user/account/account.service";

@Component({
  selector: 'app-transaction-display',
  templateUrl: './transaction-display.component.html',
  styleUrls: ['./transaction-display.component.css'],
  standalone: true,
})
export class TransactionDisplayComponent {

  @Input() transaction!: TransactionI;

}
