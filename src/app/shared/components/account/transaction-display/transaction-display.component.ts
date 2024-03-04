import {Component, Input} from '@angular/core';
import {TransactionI} from "../../../../core/services/user/account/account.service";
import {DatePipe, NgForOf} from "@angular/common";
import {QRCodeModule} from "angularx-qrcode";

@Component({
  selector: 'app-transaction-display',
  templateUrl: './transaction-display.component.html',
  styleUrls: ['./transaction-display.component.css'],
  imports: [
    DatePipe,
    NgForOf,
    QRCodeModule
  ],
  standalone: true
})
export class TransactionDisplayComponent {

    @Input() transaction!: TransactionI;

}
