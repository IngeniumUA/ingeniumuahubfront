import {Component} from '@angular/core';
import { PublicHeaderComponent } from '../../core/layout/public/header/public-header.component';
import { SidenavComponent } from '../../core/layout/behind/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-member',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.css'],
    imports: [PublicHeaderComponent, SidenavComponent, RouterOutlet]
})
export class StaffComponent {
  constructor() { }
  isSideNav: boolean = true;

  ToggleSideNav(): void {
    this.isSideNav = !this.isSideNav;
  }
}
