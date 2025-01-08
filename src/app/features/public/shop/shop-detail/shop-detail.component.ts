import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {ProductsService} from '@ingenium/app/core/services/coreAPI/products.service';
import {BehaviorSubject, catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {ProductCategoryI, ProductGroupI} from '@ingenium/app/shared/models/product/products';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {HttpState} from "@ingenium/app/shared/models/httpState";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {ProductsToCategoriesPipe} from "@ingenium/app/shared/pipes/product/product_to_categoriepipe.pipe";
import {map} from "rxjs/operators";
import {calcIntensity} from "@ingenium/app/shared/pipes/item/colorIntensity";

@Component({
  selector: 'app-page',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {
  // Layout
  isCartEmpty$: Observable<number>;
  // shop Info and Deco
  itemId!: string;
  shopItemResponse$!: Observable<HttpState<ItemWideLimitedI>>;
  shopError$!: Observable<any>;

  productCategories$!: Observable<ProductCategoryI[]>;
  currentProductCategoryIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<ProductGroupI[]>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              protected layoutService: LayoutService,
              private shopService: ShopService,
              private productService: ProductsService,
              store: Store) {
    this.isCartEmpty$ = store.select(CartState.getProductCount);
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.router.navigateByUrl('/shop');
      return;
    }

    // Setup shop observable and color observables
    this.setShop(id);

    // Setup product table
    const product_to_categorie = new ProductsToCategoriesPipe();
    this.productCategories$ = this.productService.getProducts(id).pipe(
      map(productArray => product_to_categorie.transform(productArray)),
      shareReplay()
    );
    this.setProductCategory(0);
  }

  setShop(id: string): void {
    // Fetch access_key (if exists)
    const accessKey: string | null = this.route.snapshot.queryParamMap.get('access_key');

    this.itemId = id;
    this.shopItemResponse$ = this.shopService.getShop(id, accessKey).pipe();
    this.shopError$ = this.shopItemResponse$.pipe(
      ignoreElements(),
      catchError((err) => {
        this.router.navigateByUrl('/shop').then(_ => {});
        return of(err);
      }));
  }

  setProductCategory(index: number): void {
    this.currentProductGroups = this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategoryIndex$.value].product_groups;
    }));
    this.currentProductCategoryIndex$.next(index);
  }

  currentCategory$(): Observable<string | null> {
    return this.productCategories$.pipe(map((productGroups) => {
      if (productGroups.length == 0) {
        return null;
      }
      return productGroups[this.currentProductCategoryIndex$.value].categorie_name;
    }));
  }

  getCategoryButtonStyle(isCurrentCategorie: boolean, backgroundColor: string): object {
    if (isCurrentCategorie) {
      return {'background-color': 'white', 'color': 'black', 'font-weight': 'bolder'}
    }

    return {'background-color': backgroundColor,
      'color': calcIntensity(backgroundColor) < 180 ? 'white' : 'black',
      'font-weight': 'bold'}
  }
}
