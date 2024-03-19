import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgClass, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-behindheader',
  templateUrl: './behindheader.component.html',
  styleUrls: ['./behindheader.component.css'],
  standalone: true,
  imports: [
    NgStyle,
    NgClass,
    NgIf
  ]
})
export class BehindheaderComponent {
  constructor(private router: Router) {
  }
  @Input() light_theme: boolean = false;  // 'dark' or 'light'
  @Input() background: boolean = true;  // If background is shown ( and vh is required )
  @Output() isToggle = new EventEmitter<boolean>();
  sideNavToggle: boolean = true;

  Home(): void {
    this.router.navigate(['home']);
  }
  ToggleSideNav(): void {
    this.isToggle.emit(this.sideNavToggle);
  }
}
