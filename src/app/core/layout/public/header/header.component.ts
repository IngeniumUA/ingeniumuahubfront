import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {NavigationStart, Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../services/user/auth/auth.service";
import {distinctUntilChanged} from "rxjs/operators";


@Component({
  selector: 'app-layout-header', // HTML tag for importing ( see app.component.html )
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true, // Allows it to be imported outside of routing
  imports: [
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    NgClass,
  ],
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = true;
  isNavdropdown: boolean = false;
  isAuth: boolean = false;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,
              private authService: AuthService) {
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
      }
      this.isNavdropdown = false;
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
