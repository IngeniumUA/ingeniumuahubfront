import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../../../core/services/coreAPI/user/account.service';
import {exhaustMap, Observable, Subscription, timer} from 'rxjs';
import {UserTrackerService} from '@ingenium/app/core/services/coreAPI/user/user-tracker.service';
import {HubCheckoutTrackerI, HubCheckoutTrackerStatusEnum} from '@ingenium/app/shared/models/tracker';
import QRCode from 'qrcode';
import {TransactionLimitedI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";
import {CapacitorHttp} from "@capacitor/core";
import {apiEnviroment} from "@ingenium/environments/environment";
import {UserState} from "@ingenium/app/core/store";
import {Store} from "@ngxs/store";
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import {WalletI} from "@ingenium/app/shared/models/user/accountI";

@Component({
  selector: 'app-account-transactions',
  templateUrl: './account-transactions.component.html',
  styleUrls: ['./account-transactions.component.scss']
})
export class AccountTransactionsComponent implements OnInit, OnDestroy {
  constructor(private accountService: AccountService,
              private trackerService: UserTrackerService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform,
              private store: Store,) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
    this.setPlatform()
    ScreenBrightness.getBrightness().then((result) => {this.brightness = result.brightness});
  }

  lastUpdate: Date = new Date();
  trackerSubscription: Subscription = new Subscription();
  transactions$: Observable<TransactionLimitedI[]> = this.accountService.getTransactions();
  trackedItems: HubCheckoutTrackerI[] = [];

  qrCode: {[key:string]:string} = {};
  qrCodeVisible: {[key:string]:boolean} = {};

  platformName: string = ""
  walletLinks: {[key:string]:string} = {};
  returnMsg: string = ""
  brightness: number = 0

  ngOnInit() {
    ScreenBrightness.getBrightness().then((result) => {this.brightness = result.brightness});
    this.transactions$ = this.accountService.getTransactions();
    this.transactions$.subscribe({next: (transactions) => {
      for (let transaction of transactions) {
        if (this.qrCodeVisible[transaction.interaction.interaction_uuid] === undefined) {
          this.qrCodeVisible[transaction.interaction.interaction_uuid] = false
        }
      }
    }})
    this.setPlatform()
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
    ScreenBrightness.getBrightness().then((result) => {
      this.brightness = result.brightness
      ScreenBrightness.setBrightness({brightness: 1.0}).then()
    });
    this.qrCodeVisible[transaction.interaction.interaction_uuid] = !this.qrCodeVisible[transaction.interaction.interaction_uuid];
  }

  getCheckoutId(_index: number, item: HubCheckoutTrackerI) {
    return item.checkout.id;
  }

  ngOnDestroy() {
    this.trackerSubscription.unsubscribe();
  }

  protected readonly TrackerStatusEnum = HubCheckoutTrackerStatusEnum;

  setModalOpen(isOpen: boolean, transaction: TransactionLimitedI) {
    this.qrCodeVisible[transaction.interaction.interaction_uuid] = isOpen;
    if (!isOpen) {
      ScreenBrightness.setBrightness({brightness: this.brightness}).then()
    }
  }

  setPlatform() {
    if (this.platform.is("android")) {
      this.platformName = "android"
    } else if (this.platform.is("ios")) {
      this.platformName = "ios"
    }
  }

  sendWalletLink(transaction: TransactionLimitedI): void {

    if (this.walletLinks[transaction.interaction.interaction_uuid] === undefined) {
      this.getWalletLink(transaction).then((result) => {
        this.walletLinks[transaction.interaction.interaction_uuid] = result
        if (this.walletLinks[transaction.interaction.interaction_uuid] !== "") {
          const link = document.createElement('a');
          link.href = this.walletLinks[transaction.interaction.interaction_uuid];
          link.click();
        }
      })
    } else {
      if (this.walletLinks[transaction.interaction.interaction_uuid] !== "") {
        const link = document.createElement('a');
        link.href = this.walletLinks[transaction.interaction.interaction_uuid];
        link.click();
      }
    }
    return
  }

  async getWalletLink(transaction: TransactionLimitedI): Promise<string> {

    try {
      const options = {
        url: apiEnviroment.apiUrl + "account/wallet/" + transaction.interaction.interaction_uuid,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options);

      if (response.status === 200) {
        let jsonResponse = await response.data as WalletI
        if (this.platform.is("android")) {
          this.returnMsg = jsonResponse.google_wallet_link
        } else if (this.platform.is("ios")) {
          this.returnMsg = jsonResponse.apple_wallet_link
        }
      } else {
        this.returnMsg = ""
        console.log(response.status)
        console.log(JSON.stringify(response.data))
      }

    } catch (error) {
      console.log(error)
      this.returnMsg = "server_error"
    }

    return this.returnMsg

  }

}
