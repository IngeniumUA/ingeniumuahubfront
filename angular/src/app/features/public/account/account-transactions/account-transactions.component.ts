import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../../../core/services/coreAPI/user/account.service';
import {exhaustMap, Observable, Subscription, timer} from 'rxjs';
import {UserTrackerService} from '@ingenium/app/core/services/coreAPI/user/user-tracker.service';
import {HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum} from '@ingenium/app/shared/models/tracker';
import QRCode from 'qrcode';
import {TransactionLimitedI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnInit, OnDestroy {
  constructor(private accountService: AccountService,
              private trackerService: UserTrackerService,
              private router: Router) {}

  lastUpdate: Date = new Date();
  trackerSubscription: Subscription = new Subscription();
  transactions$: Observable<TransactionLimitedI[]> = this.accountService.getTransactions();
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

  async createQrCode(transaction: TransactionLimitedI) {
    try {
      this.qrCode[transaction.interaction.interaction_uuid] = await QRCode.toDataURL(transaction.interaction.interaction_uuid, {
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

  toggleQrCodeVisible(transaction: TransactionLimitedI) {
    console.log(this.qrCode[transaction.interaction.interaction_uuid]);

    if (this.qrCode[transaction.interaction.interaction_uuid] === undefined) {
      this.createQrCode(transaction);
    }

    this.qrCodeVisible[transaction.interaction.interaction_uuid] = !this.qrCodeVisible[transaction.interaction.interaction_uuid];
  }

  getCheckoutId(_index: number, item: HubCheckoutTrackerI) {
    return item.checkout.id;
  }

  ngOnDestroy() {
    this.trackerSubscription.unsubscribe();
  }

  getWalletLink(transaction: TransactionLimitedI, platform: string): void {
    const transaction_uuid: string = transaction.interaction.interaction_uuid
    let nummer: number = +transaction_uuid.replace(/\D/g, "")
    let nummer_str: string = ""+nummer
    nummer_str = nummer_str.split("e")[0].replace(".", "")
    nummer = +nummer_str
    const locatie_naam: string = "Ingenium" //TODO fix once location is implemented

    // Get and redirect to wallet link
    const wallet_link = "/wallet/"
      + "&transaction_uuid="
      + transaction_uuid
      + "&nummer="
      + nummer
      + "&locatie_naam="
      + locatie_naam
      + "&platform="
      + platform
    this.router.navigateByUrl(wallet_link)

    return
  }


  protected readonly TrackerStatusEnum = HubCheckoutTrackerStatusEnum;
}
