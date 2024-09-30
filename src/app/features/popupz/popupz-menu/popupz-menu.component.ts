import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {IProductItem} from "@ingenium/app/shared/models/items/products/products";
import {take} from "rxjs";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {CartActions} from "@ingenium/app/core/store";
import {ToastrService} from "ngx-toastr";
import {FormsModule} from "@angular/forms";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-popupz-menu',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './popupz-menu.component.html',
  styleUrl: './popupz-menu.component.scss'
})
export class PopupzMenuComponent {
  allProducts: IProductItem[] = [];
  products: IProductItem[] = [];
  itemName = "Pop-Up Z";

  category: string|undefined = undefined;

  forceSauceOn: string[] = ["Durum Kebab", "Durum Falafel"];
  sauceSelection: {[key:number]:string} = {};
  sauceOptions = ['Look', 'Mayo', 'Andalouse', 'Mamout', 'Ketchup'];

  constructor(private httpClient: HttpClient, private store: Store, private toastrService: ToastrService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
        this.category = params['category'];
        this.products = this.filterProducts(this.allProducts);
    });

    this.getProducts();
  }

  getProducts() {
    this.httpClient.get<IProductItem[]>(`${apiEnviroment.apiUrl}item/products/${this.itemName}`)
        .pipe(
            take(1),
            map(products => {
              this.allProducts = products;
              this.products = this.filterProducts(products);
            })
        )
        .subscribe();
  }

  filterProducts(products: IProductItem[]) {
    return products.filter((product: IProductItem): boolean => {
      return this.category === undefined || this.category === "" || product.product_meta.categorie === this.category;
    });
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
    if (this.forceSauceOn.includes(product.name)) {
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
