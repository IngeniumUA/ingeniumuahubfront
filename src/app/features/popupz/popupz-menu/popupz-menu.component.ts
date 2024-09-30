import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {IProductItem} from "@ingenium/app/shared/models/items/products/products";
import {Observable, of} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {CartActions} from "@ingenium/app/core/store";
import {ToastrService} from "ngx-toastr";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-popupz-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './popupz-menu.component.html',
  styleUrl: './popupz-menu.component.scss'
})
export class PopupzMenuComponent {
  $products: Observable<IProductItem[]> = of([]);
  itemName = "Pop-Up Z";

  forceSauceOn: string = "Durum Kebab";
  sauceSelection: {[key:number]:string} = {};
  sauceOptions = ['Look', 'Mayo', 'Andalouse', 'Mamout', 'Ketchup'];

  constructor(private httpClient: HttpClient, private store: Store, private toastrService: ToastrService) {
    this.getProducts();
  }

  getProducts() {
    this.$products = this.httpClient.get<IProductItem[]>(`${apiEnviroment.apiUrl}item/products/${this.itemName}`);
  }

  changeSauce(event: any, productId: number) {
    const sauce = event.target.value;
    // Check if the sauce actually exists
    if (!this.sauceOptions.includes(sauce)) {
      this.toastrService.error('Gelieve een saus te selecteren.');
      return;
    }
    this.sauceSelection[productId] = event.target.value;
  }

  addToCard(product: IProductItem) {
    if (this.forceSauceOn === product.name) {
      if (!this.sauceSelection[product.id]) {
        this.toastrService.error('Gelieve een saus te selecteren.');
        return;
      }

      // Create a new product object with the sauce
      product = {
        ...product,
        product_meta: {
          ...product.product_meta,
          other_meta_data: {
            'sauce': this.sauceSelection[product.id],
          }
        }
      }
    }

    this.store.dispatch(new CartActions.AddToCart(product));
    this.toastrService.success('Het product werd toevergevoegd aan uw winkelmandje.');
  }
}
