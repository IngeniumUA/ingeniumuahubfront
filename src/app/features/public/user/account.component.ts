import {Component, OnInit} from '@angular/core';
import {HubAccountData, HubAuthData} from "../../../shared/models/user";
import {AuthService} from "../../../core/services/user/auth/auth.service";
import {HubaccountService} from "../../../core/services/user/account/hubaccount.service";

@Component({
  selector: 'app-user',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private authService: AuthService,
              private accountService: HubaccountService) {
  }

  account?: HubAccountData;
  userauth?: HubAuthData;

  ngOnInit(): void {
    this.accountService.getAccount().
    subscribe((data) => {
      this.account = data;})

  this.authService.user.subscribe((data) => {
    if (data) {
      this.userauth = data;
    }
  })
  }


  RefreshAuth(): void {
    this.authService.refreshAccessToken().subscribe();
  }

  Logout(): void {
    this.authService.logout();
  }
}
