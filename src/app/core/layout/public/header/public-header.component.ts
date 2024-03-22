import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {NgClass, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet} from '@angular/common';
import {NavigationStart, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../services/user/auth/auth.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {User} from '../../../store';


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
  ],
})
export class PublicHeaderComponent implements OnInit {
  mobileMenuOpen: boolean = false;
  accountDropdownOpen: boolean = false;
  infoDropdownOpen: boolean = false;

  isNavdropdown: boolean = false;
  isAuth: boolean = false;

  @Input() light_theme: boolean = false;  // 'dark' or 'light'
  @Input() background: boolean = true;  // If background is shown ( and vh is required )

  @Input() internalToggle: boolean = true; // If toggling the navbar should use this navbar or outsource it
  @Output() isToggleEmitter = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit() {
    if (this.authService.userValue) {
      this.isAuth = true;
    }

    this.authService.user
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.isAuth = data != null;
      });
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
