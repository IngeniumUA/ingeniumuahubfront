import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AsyncPipe, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AccountService} from '../../../../core/services/coreAPI/user/account.service';
import {Observable} from "rxjs";
import {CardItemWideLimitedI, CardMembershipEnum} from "@ingenium/app/shared/models/item/cardI";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css'],
    imports: [
        RouterLink,
        NgIf,
        AsyncPipe,
        ReactiveFormsModule,
        NgClass,
        TitleCasePipe
    ]
})
export class CardComponent implements OnInit {
  @Input() is_lid: boolean = false;

  constructor(private route: ActivatedRoute,
              private accountService: AccountService,
              private toastrService: ToastrService) {
  }

  $card: Observable<CardItemWideLimitedI> | null = null;
  success_notification: string | null = null;
  failed_notification: string | null = null;

  ngOnInit() {
    this.$card = this.accountService.getCard();

    const notification: string | null = this.route.snapshot.queryParams['card_notification'] || null;
    if (notification != null) {
      if (notification.startsWith('s')) {
        this.success_notification = notification.slice(2);
        this.toastrService.success('Membership Added! :D');
      } else if (notification.startsWith('f')) {
        this.failed_notification = notification.slice(2);
        this.toastrService.error('Card linking failed! :(');
      }
    }
  }
  loading: boolean = false;
  protected readonly CardMembershipEnum = CardMembershipEnum;
}
