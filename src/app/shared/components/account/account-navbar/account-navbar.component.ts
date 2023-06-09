import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-account-navbar',
    templateUrl: './account-navbar.component.html',
    styleUrls: ['./account-navbar.component.css'],
  imports: [
    RouterLink,
    NgIf,
    NgClass,
    AsyncPipe
  ],
    standalone: true
})
export class AccountNavbarComponent {
  @Input() alignedBottom: boolean = true;

  isMobile$: Observable<boolean> = this.layoutService.isMobile;

  constructor(private layoutService: LayoutService) {
  }
}
