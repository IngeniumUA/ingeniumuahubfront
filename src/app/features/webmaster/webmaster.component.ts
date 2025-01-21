import { Component } from '@angular/core';

@Component({
    selector: 'app-webmaster',
    templateUrl: './webmaster.component.html',
    styleUrls: ['./webmaster.component.scss'],
    standalone: false
})
export class WebmasterComponent {
  constructor() { }
  isSideNav: boolean = true;

  ToggleSideNav(): void {
    this.isSideNav = !this.isSideNav;
  }
}
