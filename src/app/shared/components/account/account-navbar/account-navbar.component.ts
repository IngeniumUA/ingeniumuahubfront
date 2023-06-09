import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";

@Component({
    selector: 'app-account-navbar',
    templateUrl: './account-navbar.component.html',
    styleUrls: ['./account-navbar.component.css'],
  imports: [
    RouterLink,
    NgIf,
    NgClass
  ],
    standalone: true
})
export class AccountNavbarComponent {
  @Input() alignedBottom: boolean = true;
}
