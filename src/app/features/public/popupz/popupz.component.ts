import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartService } from 'src/app/core/services/shop/cart/cart.service';
import { EventItemDetailI } from 'src/app/shared/models/items/events';
import { IItem } from 'src/app/shared/models/items/IItem';
import { IProductItem } from 'src/app/shared/models/items/products/products';
import { apiEnviroment } from 'src/enviroments';

@Component({
  selector: 'app-page',
  templateUrl: './popupz.component.html',
  styleUrls: ['./popupz.component.scss']
})
export class PopupzComponent {
  category: 'food' | 'drinks' | 'snacks' = 'food';
  products$: Observable<IProductItem[]> = of([]);
  event: EventItemDetailI = {} as EventItemDetailI;

  constructor(private httpClient: HttpClient, private cartService: CartService) {}

  ngOnInit() {
    this.getProducts();
    this.httpClient.get<EventItemDetailI>(apiEnviroment.apiUrl + "popup/event").subscribe((item) => {
      this.event = item;
    });
  }

  setCategory(category: 'food' | 'drinks' | 'snacks'): void {
    this.category = category;
    this.getProducts();
  }

  getProducts(): void {
    this.products$ = this.httpClient.get<IProductItem[]>(apiEnviroment.apiUrl + "popup/" + this.category);
  }

  addProduct(product: IProductItem): void {
    this.cartService.setProductCount(this.event.item, product, 1);
  }
}
