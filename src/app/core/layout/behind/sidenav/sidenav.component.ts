import {Component, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {RolesService} from '../../../services/user/roles.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    AsyncPipe,
    RouterLinkActive,
    RouterOutlet
  ]
})
export class SidenavComponent {
  @Input() isSidenav: boolean = true;

  isWebmaster$: Observable<boolean> = this.rolesService.isWebmaster;
  isManager$: Observable<boolean> = this.rolesService.isManager;

  constructor(private rolesService: RolesService
  ) {
  }
}
