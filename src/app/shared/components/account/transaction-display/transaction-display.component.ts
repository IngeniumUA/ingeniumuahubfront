import {Component, Input} from '@angular/core';
import {TransactionI} from '../../../../core/services/user/account/account.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import QRCode from 'qrcode'; // TODO: Remove qrcode dependency since it depends on CommonJS module system which enlarges the bundle size

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
  qrCode: string = "";
  qrCodeVisible: boolean = false;

  async createQrCode() {
    try {
      this.qrCode = await QRCode.toDataURL(this.transaction.interaction.uuid, {
        color: {
          dark: '#00053D',
          light: '#FFF',
        },
      });
      return true;
    } catch (_err) {
      return false;
    }
  }

  toggleQrCodeVisible() {
    if (this.qrCode === "") {
      this.createQrCode();
    }

    this.qrCodeVisible = !this.qrCodeVisible;
  }
}
