import { Component } from '@angular/core';
import { PublicHeaderComponent } from '../../core/layout/public/header/public-header.component';
import { SidenavComponent } from '../../core/layout/behind/sidenav/sidenav.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-webmaster',
    templateUrl: './webmaster.component.html',
    styleUrls: ['./webmaster.component.scss'],
    imports: [PublicHeaderComponent, SidenavComponent, RouterOutlet]
})
export class WebmasterComponent {
  constructor() { }
  isSideNav: boolean = true;

  ToggleSideNav(): void {
    this.isSideNav = !this.isSideNav;
  }
}
