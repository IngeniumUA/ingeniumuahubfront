import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-behindheader',
  templateUrl: './behindheader.component.html',
  styleUrls: ['./behindheader.component.css'],
  standalone: true,
})
export class BehindheaderComponent {
  constructor(private router: Router) {
  }
  @Output() isToggle = new EventEmitter<boolean>();
  sideNavToggle: boolean = true;

  Home(): void {
    this.router.navigate(['home']);
  }
  ToggleSideNav(): void {
    this.isToggle.emit(this.sideNavToggle);
  }
}
