import {Component, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {RolesService} from "../../../services/user/roles.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    AsyncPipe
  ]
})
export class SidenavComponent {
  @Input() isSidenav: boolean = true;

  isWebmaster$: Observable<Boolean> = this.rolesService.isWebmaster
  isManager$: Observable<Boolean> = this.rolesService.isManager

  constructor(private rolesService: RolesService
  ) {
  }
}
