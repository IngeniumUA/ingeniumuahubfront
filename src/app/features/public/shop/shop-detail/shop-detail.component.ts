import {Component, OnInit} from '@angular/core';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {ProductsService} from '@ingenium/app/core/services/coreAPI/products.service';
import {catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {ProductOutI} from '@ingenium/app/shared/models/product/products';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {currentPage} from "@app_services/page-tracking.service";
import {backButtonClicked, AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-page',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {

  constructor(private layoutService: LayoutService,
              private shopService: ShopService,
              private productService: ProductsService,
              private appFunctionsService: AppFunctionsService,) {
    backButtonClicked()
  }

  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  isCartEmpty: boolean = false;
  // Event Info and Deco
  shopItem$?: Observable<ItemWideLimitedI>;
  shopError$!: Observable<any>;
  products$: Observable<ProductOutI[]> = of([]);

  ngOnInit() {
    // Fetch ID
    const thisUrl: string = currentPage
    let id: string | null = thisUrl.replace("sub/shop/", "")
    if (id === thisUrl) {id = null}

    // If ID is null
    if (id === null) {
      this.gotoPage('/sub/shop')
      return;
    }

    // Setup event observable and color observables
    this.Setup(id);
  }

  public Setup(id: string) {
    this.shopItem$ = this.shopService.getShop(id);
    this.shopError$ = this.shopItem$.pipe(
      ignoreElements(),
      catchError((err) => {
        this.gotoPage('home')
        return of(err);
      }));
    this.products$ = this.productService.getProducts(id).pipe(shareReplay());
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
