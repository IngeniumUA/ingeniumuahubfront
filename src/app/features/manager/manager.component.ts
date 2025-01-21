import { Component } from '@angular/core';
import { PublicHeaderComponent } from '../../core/layout/public/header/public-header.component';
import { SidenavComponent } from '../../core/layout/behind/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-manager',
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.css'],
    imports: [PublicHeaderComponent, SidenavComponent, RouterOutlet]
})
export class ManagerComponent {
  constructor() { }
  isSideNav: boolean = true;

  ToggleSideNav(): void {
    this.isSideNav = !this.isSideNav;
  }
}
