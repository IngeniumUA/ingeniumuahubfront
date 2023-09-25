import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../../core/services/user/account/account.service";
import {CardService} from "../../../core/services/user/card.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-card-redirect',
  templateUrl: './card-redirect.component.html',
  styleUrls: ['./card-redirect.component.css']
})
export class CardRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private cardService: CardService,
              private router: Router,
              private accountService: AccountService) {
  }

  ngOnInit() {
    const card_uuid: string | null = this.route.snapshot.paramMap.get('id')

    if (card_uuid === null) {
      this.router.navigateByUrl('home')
    }

    // Submit card to backend
    this.cardService.post_card_uuid(card_uuid!).pipe(
      first()).subscribe({

      next: () => {
        // User was added to lid
        this.cardService.link_card(card_uuid!).pipe(
          first()).subscribe({
          next: () => {
            this.router.navigateByUrl('/account')
            return
          },
          error: (error: any) => {
            this.router.navigateByUrl('/account')
            return
          }
        })
      },
      error: (error: any) => {
        this.router.navigateByUrl('/account')
        return
      }
    })


    this.router.navigateByUrl('/account/card')
  }
}
