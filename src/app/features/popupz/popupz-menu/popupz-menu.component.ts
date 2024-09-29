import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {IProductItem} from "@ingenium/app/shared/models/items/products/products";
import {Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {Store} from "@ngxs/store";
import {CartActions} from "@ingenium/app/core/store";

@Component({
  selector: 'app-popupz-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ],
  templateUrl: './popupz-menu.component.html',
  styleUrl: './popupz-menu.component.scss'
})
export class PopupzMenuComponent {
  $products: Observable<IProductItem[]> = of([]);
  itemName = "Pop-Up Z";

  constructor(private httpClient: HttpClient, private store: Store) {
    this.getProducts();
  }

  getProducts() {
    this.$products = this.httpClient.get<IProductItem[]>(`${apiEnviroment.apiUrl}item/products/${this.itemName}`);
  }

  addToCard(product: IProductItem) {
    this.store.dispatch(new CartActions.AddToCart(product));
  }
}
