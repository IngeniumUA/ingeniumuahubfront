import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService, TransactionI} from '../../../../core/services/user/account/account.service';
import {exhaustMap, Observable, Subscription, timer} from 'rxjs';
import {TrackerService} from '@ingenium/app/core/services/user/tracker.service';
import {HubCheckoutTrackerI} from '@ingenium/app/shared/models/tracker';
import QRCode from 'qrcode';

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnInit, OnDestroy {
  constructor(private accountService: AccountService,
              private trackerService: TrackerService) {}

  lastUpdate: Date = new Date();
  trackerSubscription: Subscription = new Subscription();
  transactions$: Observable<TransactionI[]> = this.accountService.getTransactions();
  trackedItems: HubCheckoutTrackerI[] = [];

  qrCode: {[key:string]:string} = {};
  qrCodeVisible: {[key:string]:boolean} = {};

  ngOnInit() {
    this.trackerSubscription = timer(0, 5000).pipe(
      exhaustMap(() => this.trackerService.getTrackers())
    ).subscribe({
      next: (data) => {
        this.trackedItems = data;
        this.lastUpdate = new Date();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

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

  getCheckoutId(_index: number, item: HubCheckoutTrackerI) {
    return item.checkout.id;
  }

  ngOnDestroy() {
    this.trackerSubscription.unsubscribe();
  }
}
