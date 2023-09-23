import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../../core/services/user/account/account.service";

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
    const card_uuid: string | null = this.route.snapshot.paramMap.get('id')

    if (card_uuid === null) {
      this.router.navigateByUrl('home')
    }

    this.router.navigateByUrl('/account/card')
  }
}
