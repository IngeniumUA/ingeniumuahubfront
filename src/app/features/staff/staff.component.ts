import {Component} from '@angular/core';

@Component({
    selector: 'app-member',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.css'],
    standalone: false
})
export class StaffComponent {
  constructor() { }
  isSideNav: boolean = true;

  ToggleSideNav(): void {
    this.isSideNav = !this.isSideNav;
  }
}
