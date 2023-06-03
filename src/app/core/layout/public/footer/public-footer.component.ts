import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import {NgClass} from "@angular/common";

@Component({
  standalone: true, // Allows it to be imported outside of routing
  selector: 'app-layout-public-footer',
  templateUrl: './public-footer.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./public-footer.component.css']
})
export class PublicFooterComponent implements OnInit {
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
