import {Component, Input} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from "@ngxs/store";

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

  isWebmaster$: Observable<boolean> = this.store.select(state => state.user.roles.is_webmaster);
  isManager$: Observable<boolean> = this.store.select(state => state.user.roles.is_manager);

  constructor(private store: Store) {}
}
