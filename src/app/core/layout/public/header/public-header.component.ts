import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Observable} from "rxjs";
import {Store} from '@ngxs/store';
import {User, UserState} from '@ingenium/app/core/store';
import {OAuthService} from "angular-oauth2-oidc";
import {UserRolesI} from "@ingenium/app/shared/models/user/userRolesI";


@Component({
  selector: 'app-layout-public-header', // HTML tag for importing ( see app.component.html )
  templateUrl: './public-header.component.html',
  styleUrls: ['./public-header.component.scss'],
  standalone: true, // Allows it to be imported outside of routing
  imports: [
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    NgClass,
    NgStyle,
    NgOptimizedImage,
    RouterLinkActive,
    AsyncPipe,
  ],
})
export class PublicHeaderComponent {
  mobileMenuOpen: boolean = false;
  accountDropdownOpen: boolean = false;
  infoDropdownOpen: boolean = false;

  email$: Observable<string|null>;
  roles$: Observable<UserRolesI|null>;
  isAuth$: Observable<boolean>;

  @Input() light_theme: boolean = false;  // 'dark' or 'light'
  @Input() background: boolean = true;  // If background is shown ( and vh is required )

  @Input() internalToggle: boolean = true; // If toggling the navbar should use this navbar or outsource it
  @Output() isToggleEmitter = new EventEmitter<boolean>();

  constructor(private store: Store, private oauthService: OAuthService, protected router: Router) {
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
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setAccountDropdown(b: boolean) {
    this.accountDropdownOpen = b;
  }

  setInfoDropdown(b: boolean) {
    this.infoDropdownOpen = b;
  }
}
