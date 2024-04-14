import { Component } from '@angular/core';
import {AccountService, TransactionI} from '../../../../core/services/user/account/account.service';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TrackerService} from '@ingenium/app/core/services/user/tracker.service';
import {HubCheckoutTrackerI} from '@ingenium/app/shared/models/tracker';
import QRCode from 'qrcode';
//import {apiEnviroment} from '../../../../../environments/environment';

/*interface Order {
  order_no: number
  status: boolean
}*/

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent {
  constructor(private accountService: AccountService,
              private trackerService: TrackerService) {
  }

  transactions$: Observable<TransactionI[]> = this.accountService.getTransactions();
  trackedItems$: Observable<HubCheckoutTrackerI[]> = this.trackerService.getTrackers();

  qrCode: {[key:string]:string} = {};
  qrCodeVisible: {[key:string]:boolean} = {};

  async createQrCode(transaction: TransactionI) {
    try {
      this.qrCode[transaction.interaction.uuid] = await QRCode.toDataURL(transaction.interaction.uuid, {
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

  toggleQrCodeVisible(transaction: TransactionI) {
    console.log(this.qrCode[transaction.interaction.uuid]);

    if (this.qrCode[transaction.interaction.uuid] === undefined) {
      this.createQrCode(transaction);
    }

    this.qrCodeVisible[transaction.interaction.uuid] = !this.qrCodeVisible[transaction.interaction.uuid];
  }
}
