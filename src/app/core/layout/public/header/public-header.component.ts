import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {NgClass, NgIf, NgStyle, NgTemplateOutlet} from "@angular/common";
import {NavigationStart, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/user/auth/auth.service";
import {distinctUntilChanged} from "rxjs/operators";


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
  ],
})
export class PublicHeaderComponent implements OnInit {
  isMobile: boolean = true;
  isNavdropdown: boolean = false;
  isAuth: boolean = false;

  @Input() light_theme: boolean = false;  // 'dark' or 'light'
  @Input() background: boolean = true;  // If background is shown ( and vh is required )

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,
              private authService: AuthService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.isNavdropdown = false;
      }
    });
  }

  ngOnInit() {
    if (this.authService.userValue) {
      this.isAuth = true;
    }
    if (this.authService.user.
      pipe(distinctUntilChanged())
      .subscribe((data) => {
          this.isAuth = data != null;
        }))

    this.breakpointObserver  // Breakpoint Observable for responsiveness
      .observe(['(min-width: 850px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = !state.matches;
      });
  }

  ToggleNavDropdown(): void {
    this.isNavdropdown = ! this.isNavdropdown;
  }

  Home(): void {
    this.router.navigate(['home']);
  }

  EventClick() {
    this.router.navigate(['event/']);
  }
}
