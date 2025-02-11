import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage} from '@angular/common';
import {Observable} from "rxjs";
import {Store} from '@ngxs/store';
import {User, UserState} from '@ingenium/app/core/store';
import {OAuthService} from "angular-oauth2-oidc";
import {Router} from "@angular/router";
import {AppFunctionsService} from "@app_services/app-functions.service";


@Component({
  selector: 'app-layout-public-header', // HTML tag for importing ( see app.component.html )
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss'],
  standalone: true, // Allows it to be imported outside of routing
  imports: [
    NgIf,
    NgClass,
    NgOptimizedImage,
    AsyncPipe,
  ],
})
export class PublicHeaderComponent {
  mobileMenuOpen: boolean = false;
  accountDropdownOpen: boolean = false;
  infoDropdownOpen: boolean = false;

  email$: Observable<string|null>;
  roles$: Observable<string[]|null>;
  isAuth$: Observable<boolean>;

  @Input() light_theme: boolean = false;  // 'dark' or 'light'
  @Input() background: boolean = true;  // If background is shown ( and vh is required )

  @Input() internalToggle: boolean = true; // If toggling the navbar should use this navbar or outsource it
  @Output() isToggleEmitter = new EventEmitter<boolean>();

  constructor(private store: Store,
              protected router: Router,
              private appFunctionsService: AppFunctionsService,) {
    this.email$ = store.select(UserState.email);
    this.roles$ = store.select(UserState.roles);
    this.isAuth$ = store.select(UserState.isAuthenticated);
  }

  Login() {
    this.store.dispatch(new User.Login());
  }

  Logout() {
    this.store.dispatch(new User.Logout());
  }

  ToggleNavDropdown() {
    // If internalToggle is False we want to emit the toggle event out of the component
    // This is used on the staff pages when on mobile devices
    if (this.internalToggle) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    } else {
      this.isToggleEmitter.emit(true);
    }
  }

  setAccountDropdown(b: boolean) {
    this.accountDropdownOpen = b;
  }

  setInfoDropdown(b: boolean) {
    this.infoDropdownOpen = b;
  }

  hasAnyRole(roles: string[]|null): boolean {
    // This is kind of trash but this will do for now
    return roles?.some(role => {
      return ['manager', 'staff', 'webmaster'].includes(role);
    }) ?? false;
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}
}
