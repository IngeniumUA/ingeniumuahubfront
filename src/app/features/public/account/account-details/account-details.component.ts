import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/user/auth/auth.service';
import {AccountService} from '../../../../core/services/user/account/account.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RolesService} from '../../../../core/services/user/roles.service';
import {HubAccountData, HubAuthData, HubUserRolesI} from '../../../../shared/models/user';

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

  account$: Observable<HubAccountData> = this.accountService.getAccount();
  userauth?: HubAuthData;

  roles$: Observable<HubUserRolesI> = this.rolesService.getRoles();

  form_success: string | null = null;

  ngOnInit(): void {
    this.authService.user.subscribe((data) => {
      if (data) {
        this.userauth = data;}
    });
  }

  SetupAccount(accountEvent: string = ''): void {
    // Fetch accountdata from API
    this.account$ = this.accountService.getAccount();

    // When called from child component the accountEvent will have content
    if (accountEvent === 'submitted') {
      this.form_success = 'Success!';
      // Success message is displayed in child component
      // Maybe we can add code here later
      // But there is no usecase (yet)
    }
  }

  RefreshAuth(): void {
    this.authService.refreshAccessToken().subscribe();
  }

  Logout(): void {
    this.authService.logout();
  }
}
