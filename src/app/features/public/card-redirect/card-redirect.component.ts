import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../../core/services/coreAPI/user/account.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {CardItemWideLimitedI} from "@ingenium/app/shared/models/item/cardI";
import {currentPage} from "@app_services/page-tracking.service";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-card-redirect',
  templateUrl: './card-redirect.component.html',
  styleUrls: ['./card-redirect.component.css']
})
export class CardRedirectComponent implements OnInit {

  constructor(private accountService: AccountService,
              private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
  }

  ngOnInit() {
    const card_uuid_arr: string[] = currentPage.split("/")
    let card_uuid: string | null = card_uuid_arr[card_uuid_arr.length-1]
    if (card_uuid === undefined) {card_uuid = null}

    if (card_uuid === null) {
      this.gotoPage('home')
    }

    // Submit card to backend
    this.accountService.linkCard(card_uuid!).pipe(first()).subscribe({
      next: (response: CardItemWideLimitedI) => {
        // User was added to lid
        const notification = this.HandleSuccesResponse(response);
        this.gotoPage('sub/account' + '?card_notification=s_'+notification)
        return;
      },
      error: (error: any) => {
        const notification = this.HandleErrorResponse(error);
        this.gotoPage('sub/account' + '?card_notification=f_'+notification)
        return;
      }
    });

    this.gotoPage('sub/account/card')
  }

  HandleSuccesResponse(_response: CardItemWideLimitedI): string {
    return 'Kaart gelinkt!';
  }

  HandleErrorResponse(response: any): string {
    if (response instanceof HttpErrorResponse) {
      const status_code = response.status;
      if (status_code == 406) {
        return response.error['detail']['Error'];
      } else if (status_code == 404) {
        return 'Ongeldige kaart!';
      } else if (status_code == 500) {
        return response.error['detail']['Error'];
      }

      return 'Ongekende Server Error!';
    }
    // If the response is not a HTTPResponse we throw unknown error
    return 'Ongekende Error!';
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}
}
