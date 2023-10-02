import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../core/services/user/auth/auth.service";
import {AccountService} from "../../../../core/services/user/account/account.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RolesService} from "../../../../core/services/user/roles.service";
import {HubAccountData, HubAuthData, HubUserRolesI} from "../../../../shared/models/user";

@Component({
  selector: 'app-page',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  constructor(protected authService: AuthService,
              private accountService: AccountService,
              private rolesService: RolesService,
              private httpClient: HttpClient) {
  }

  account: Observable<HubAccountData> = this.accountService.getAccount();
  userauth?: HubAuthData;

  roles$: Observable<HubUserRolesI> = this.rolesService.getRoles();

  ngOnInit(): void {
    this.authService.user.subscribe((data) => {
      if (data) {
        this.userauth = data;}
    })
  }

  RefreshAuth(): void {
    this.authService.refreshAccessToken().subscribe();
  }

  Logout(): void {
    this.authService.logout();
  }
}
