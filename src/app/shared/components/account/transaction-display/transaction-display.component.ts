import {Component, Input} from '@angular/core';
import {TransactionI} from "../../../../core/services/user/account/account.service";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-transaction-display',
  templateUrl: './transaction-display.component.html',
  styleUrls: ['./transaction-display.component.css'],
  imports: [
    DatePipe,
    NgForOf
  ],
  standalone: true
})
export class TransactionDisplayComponent {

    @Input() transaction!: TransactionI;

}
