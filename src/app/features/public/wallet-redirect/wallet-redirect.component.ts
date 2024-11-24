import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {AccountService} from "@ingenium/app/core/services/coreAPI/user/account.service";

@Component({
  selector: 'app-wallet-redirect',
  standalone: true,
  imports: [],
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
      let banner_link: string = ""
      let event_name: string = ""
      let end_date: string = ""
      let start_date: string = ""
      let nummer: number = 0
      let locatie_naam: string = ""
      let platform: string = ""
      for (const param of wallet_params) {
        if (param.startsWith("transaction_uuid=")) {
          transaction_uuid = param.replace("transaction_uuid=", "")
        } else if (param.startsWith("banner_link=")) {
          banner_link = param.replace("banner_link=", "")
        } else if (param.startsWith("event_name=")) {
          event_name = param.replace("event_name=", "")
        } else if (param.startsWith("end_date=")) {
          end_date = param.replace("end_date=", "")
        } else if (param.startsWith("start_date=")) {
          start_date = param.replace("start_date=", "")
        } else if (param.startsWith("nummer=")) {
          nummer = +param.replace("nummer=", "")
        } else if (param.startsWith("locatie_naam=")) {
          locatie_naam = param.replace("locatie_naam=", "")
        } else if (param.startsWith("platform=")) {
          platform = param.replace("platform=", "")
        }
      }

      // Get and redirect to wallet link
      this.accountService.getWalletLinks(transaction_uuid, banner_link, event_name, end_date, start_date, nummer, locatie_naam, platform).pipe(first()).subscribe({
        next: (response) => {
          window.location.href = response
        }
      })
    }

  }

}
