import {Component, OnInit} from '@angular/core';
import {HubAccountData, HubAuthData, HubAuthGroups} from "../../../../shared/models/user";
import {AuthService} from "../../../../core/services/user/auth/auth.service";
import {HubaccountService} from "../../../../core/services/user/account/hubaccount.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RolesService, UserRolesI} from "../../../../core/services/user/roles.service";

@Component({
  selector: 'app-user',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  constructor(protected authService: AuthService,
              private accountService: HubaccountService,
              private rolesService: RolesService,
              private httpClient: HttpClient) {
  }

  account: Observable<HubAccountData> = this.accountService.getAccount();
  userauth?: HubAuthData;

  roles$: Observable<UserRolesI> = this.rolesService.getRoles();

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
