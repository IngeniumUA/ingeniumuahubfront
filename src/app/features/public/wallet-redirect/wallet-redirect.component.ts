import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {AccountService} from "@ingenium/app/core/services/coreAPI/user/account.service";
import {LoadingIndicatorComponent} from "@ingenium/app/shared/components/loading-indicator/loading-indicator.component";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";

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
              private router: Router,
              private accountService: AccountService) {
  }

  ngOnInit() {
    const wallet_info: string | null = this.route.snapshot.paramMap.get('id');

    if (wallet_info === null) {
      this.router.navigateByUrl('home');
    } else {
      const wallet_params = wallet_info.split('&')
      let transaction_uuid: string = ""
      let event_item_id: number = 0
      let nummer: number = 0
      let locatie_naam: string = ""
      let platform: string = ""
      for (const param of wallet_params) {
        if (param.startsWith("transaction_uuid=")) {
          transaction_uuid = param.replace("transaction_uuid=", "")
        } else if (param.startsWith("event_item_id=")) {
          event_item_id = +param.replace("event_item_id=", "")
        } else if (param.startsWith("nummer=")) {
          nummer = +param.replace("nummer=", "")
        } else if (param.startsWith("locatie_naam=")) {
          locatie_naam = param.replace("locatie_naam=", "")
        } else if (param.startsWith("platform=")) {
          platform = param.replace("platform=", "")
        }
      }

      // Get and redirect to wallet link
      this.accountService.getWalletLinks(transaction_uuid, event_item_id, nummer, locatie_naam, platform).pipe(first()).subscribe({
        next: (response) => {
          window.location.href = response
          this.router.navigateByUrl('home')
        }
      })
    }

  }

}
