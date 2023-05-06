import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";


@Component({
  selector: 'app-layout-header', // HTML tag for importing ( see app.component.html )
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    NgIf
  ],
  // Allows it to be imported outside of routing
})
export class HeaderComponent implements OnInit {
  isMobile: boolean = true;

  constructor(private router: Router,
              private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit() {
    this.breakpointObserver  // Breakpoint Observable for responsiveness
      .observe(['(min-width: 500px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = !state.matches;
      });
  }

  toHome() {
    this.router.navigate(['/home']);
  }
}
