import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    RouterLink
  ]
})
export class SidenavComponent {
  @Input() isSidenav: boolean = true;
}
