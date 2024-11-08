import {Component, OnInit} from '@angular/core';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {ProductsService} from '@ingenium/app/core/services/shop/products/products.service';
import {catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {IProductItem} from '@ingenium/app/shared/models/items/products/products';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-page',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {

  constructor(private layoutService: LayoutService,
              private shopService: ShopService,
              private productService: ProductsService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  isCartEmpty: boolean = false;
  // Event Info and Deco
  shopItem$?: Observable<ItemWideLimitedI>;
  shopError$!: Observable<any>;
  products$: Observable<IProductItem[]> = of([]);

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

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
