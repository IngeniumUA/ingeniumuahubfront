import {Component, Input, OnInit} from '@angular/core';
import {
  IProductCategorie,
  IProductGroup,
  IProductItem
} from "../../../../models/items/products/products";
import {BehaviorSubject, Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {ProductComponent} from "../product/product.component";
import {Router} from "@angular/router";
import {CartService} from "../../../../../core/services/shop/cart/cart.service";
import {ProductsService} from "../../../../../core/services/shop/products/products.service";
import {map} from "rxjs/operators";
import {IItem} from "../../../../models/items/IItem";

@Component({
  selector: 'app-producttable',
  templateUrl: './producttable.component.html',
  styleUrls: ['./producttable.component.css'],
  imports: [
    NgStyle,
    NgForOf,
    AsyncPipe,
    ProductComponent,
    NgIf
  ],
  standalone: true
})
export class ProducttableComponent implements OnInit {
  @Input() item!: IItem;
  @Input() primaryColorFull: string = "var(--mainblue)";
  productCategories$!: Observable<IProductCategorie[]>;
  currentProductCategorieIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<IProductGroup[]>;

  constructor(private router: Router,
              private productService: ProductsService,
              private cartService: CartService) {
  }

  ngOnInit() {
    // On init select first categorie
    this.productCategories$ = this.productService.getProducts(this.item.id);
    this.SetProductCategorie(0)
  }

  SetProductCategorie(index: number): void {
    this.currentProductGroups = this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategorieIndex$.value].product_groups
    }))
    this.currentProductCategorieIndex$.next(index)
  }
  currentCategorie$(): Observable<string> {
    return this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategorieIndex$.value].categorie_name
    }))
  }

  GetCurrentProductCount(categorie_name: string, product: IProductItem): number {
    return this.cartService.getProductCount(this.item, categorie_name, product)
  }
  SetProductCount(categorie_name: string, product: IProductItem, count: number) {
    this.cartService.setProductCount(this.item, categorie_name, product, count);
  }

  RouteToCheckout(): void {
    this.router.navigate(['/shop/checkout'])
  }
}
