import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {CartState, UserState} from "@ingenium/app/core/store";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-template-wrapper',
  templateUrl: './popupz-template.component.html',
  styleUrls: ['./popupz-template.component.scss'],
})
export class PopupzTemplateComponent {
  productCount$: Observable<number> = this.store.select(CartState.getProductCount);
  isStaff$: Observable<boolean> = this.store.select(UserState.roles)
    .pipe(map((roles) => roles?.is_staff ?? false));

  foodMenuExpanded = false;

  constructor(private router: Router, private store: Store) {
    this.router.events.subscribe(() => {
      // Check if the current route is the menu page or a child of the menu page, if so open the sub menu
      this.foodMenuExpanded = this.router.url.includes('/popupz/menu');
    });
  }
}
