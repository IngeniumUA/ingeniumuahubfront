import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/user/auth/auth.service";


@Component({
  selector: 'app-layout-header', // HTML tag for importing ( see app.component.html )
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true, // Allows it to be imported outside of routing
  imports: [
    NgIf,
  ],
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = true;
  isAuth: boolean = false;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.breakpointObserver  // Breakpoint Observable for responsiveness
      .observe(['(min-width: 850px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = !state.matches;
      });

    if (this.authService.user) {
      this.isAuth = true;
    }

  }
}
