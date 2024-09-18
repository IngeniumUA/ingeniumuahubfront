import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-template-wrapper',
  templateUrl: './popupz-template.component.html',
  styleUrls: ['./popupz-template.component.scss'],
})
export class PopupzTemplateComponent {
  foodMenuExpanded = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // Check if the current route is the menu page or a child of the menu page, if so open the sub menu
      this.foodMenuExpanded = this.router.url.includes('/popupz/menu');
    });
  }
}