import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {first} from "rxjs/operators";
import {AccountService} from "@ingenium/app/core/services/coreAPI/user/account.service";
import {LoadingIndicatorComponent} from "@ingenium/app/shared/components/loading-indicator/loading-indicator.component";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";
import {UserState} from "@ingenium/app/core/store";
import {Store} from "@ngxs/store";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-wallet-redirect',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    PublicHeaderComponent
  ],
  templateUrl: './wallet-redirect.component.html',
  styleUrl: './wallet-redirect.component.css'
})
export class WalletRedirectComponent implements OnInit{

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private store: Store,
              private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
  }

  ngOnInit() {
    const wallet_info: string | null = this.route.snapshot.paramMap.get('id');

    if (wallet_info === null) {
      this.gotoPage('home');
    } else {
      const wallet_params = wallet_info.split('&')
      let transaction_uuid: string = ""
      let nummer: number = 0
      let locatie_naam: string = ""
      let platform: string = ""
      for (const param of wallet_params) {
        if (param.startsWith("transaction_uuid=")) {
          transaction_uuid = param.replace("transaction_uuid=", "")
        } else if (param.startsWith("nummer=")) {
          nummer = +param.replace("nummer=", "")
        } else if (param.startsWith("locatie_naam=")) {
          locatie_naam = param.replace("locatie_naam=", "")
        } else if (param.startsWith("platform=")) {
          platform = param.replace("platform=", "")
        }
      }

      // Get and redirect to wallet link
      this.accountService.getWalletLinks(transaction_uuid, nummer, locatie_naam, platform).pipe(first()).subscribe({
        next: (response) => {
          window.location.href = response
          if (this.store.selectSnapshot(UserState.isAuthenticated)) {
            this.gotoPage('account/transactions')
          } else {
            this.gotoPage('home')
          }
        }
      })
    }

  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
