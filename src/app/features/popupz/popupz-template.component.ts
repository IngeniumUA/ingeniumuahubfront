import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";

@Component({
  selector: 'app-template-wrapper',
  templateUrl: './popupz-template.component.html',
  styleUrls: ['./popupz-template.component.scss'],
})
export class PopupzTemplateComponent implements OnInit {
  productCount$!: Observable<number>;

  foodMenuExpanded = false;

  constructor(private router: Router, private store: Store) {
    this.router.events.subscribe(() => {
      // Check if the current route is the menu page or a child of the menu page, if so open the sub menu
      this.foodMenuExpanded = this.router.url.includes('/popupz/menu');
    });
  }

  ngOnInit () {
    this.productCount$ = this.store.select(CartState.getProductCount);
  }
}
