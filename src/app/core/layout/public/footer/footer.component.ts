import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {AuthService} from "../../../services/user/auth/auth.service";

@Component({
  selector: 'app-layout-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isMobile: boolean = true;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit() {
    this.breakpointObserver  // Breakpoint Observable for responsiveness
      .observe(['(min-width: 850px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = !state.matches;
      });
  }
}
