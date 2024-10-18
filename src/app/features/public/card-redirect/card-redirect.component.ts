import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../core/services/user/account/account.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {CardItemWideLimitedI} from "@ingenium/app/shared/models/item/cardI";

@Component({
  selector: 'app-card-redirect',
  templateUrl: './card-redirect.component.html',
  styleUrls: ['./card-redirect.component.css']
})
export class CardRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService) {
  }

  ngOnInit() {
    const card_uuid: string | null = this.route.snapshot.paramMap.get('id');

    if (card_uuid === null) {
      this.router.navigateByUrl('home');
    }

    // Submit card to backend
    this.accountService.linkCard(card_uuid!).pipe(first()).subscribe({
      next: (response: CardItemWideLimitedI) => {
        // User was added to lid
        const notification = this.HandleSuccesResponse(response);
        this.router.navigateByUrl('/account' + '?card_notification=s_'+notification);
        return;
      },
      error: (error: any) => {
        const notification = this.HandleErrorResponse(error);
        this.router.navigateByUrl('/account' + '?card_notification=f_'+notification);
        return;
      }
    });

    this.router.navigateByUrl('/account/card');
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
}
