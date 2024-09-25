import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-popupz-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './popupz-menu.component.html',
  styleUrl: './popupz-menu.component.scss'
})
export class PopupzMenuComponent {
  constructor() {}
}
