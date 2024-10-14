import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {ProductsService} from '@ingenium/app/core/services/shop/products/products.service';
import {catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {IProductItem} from '@ingenium/app/shared/models/items/products/products';
import {ShopService} from "@ingenium/app/core/services/coreAPI/item/derived_services/shop.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";

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
              private productService: ProductsService) {
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
}
