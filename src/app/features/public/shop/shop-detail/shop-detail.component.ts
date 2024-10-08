import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '../../../../core/services/layout/layout.service';
import {CartService} from '../../../../core/services/shop/cart/cart.service';
import {ProductsService} from '../../../../core/services/shop/products/products.service';
import {catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {IProductItem} from '../../../../shared/models/items/products/products';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";

@Component({
  selector: 'app-page',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private layoutService: LayoutService,
              private shopService: ShopService,
              private cartService: CartService,
              private productService: ProductsService) {
  }

  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  isCartEmpty: boolean = !this.cartService.hasTransactions();
  // Event Info and Deco
  shopItem$?: Observable<ItemWideLimitedI>;
  shopError$!: Observable<any>;
  products$: Observable<IProductItem[]> = of([]);

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.router.navigateByUrl('/shop');
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
        this.router.navigateByUrl('/home');
        return of(err);
      }));
    this.products$ = this.productService.getProducts(id).pipe(shareReplay());
  }

  GetCurrentProductCount(item: ItemLimitedI, product: IProductItem): number {
    return this.cartService.getProductCount(item, product);
  }
  SetProductCount(item: ItemLimitedI, product: IProductItem, count: number) {
    this.cartService.setProductCount(item, product, count);
    this.isCartEmpty = !this.cartService.hasTransactions();
  }
}
