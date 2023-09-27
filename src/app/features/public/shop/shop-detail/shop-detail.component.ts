import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {EventService} from "../../../../core/services/items/events/event.service";
import {CartService} from "../../../../core/services/shop/cart/cart.service";
import {ProductsService} from "../../../../core/services/shop/products/products.service";
import {catchError, ignoreElements, Observable, of, shareReplay} from "rxjs";
import {EventItemDetailI} from "../../../../shared/models/items/events";
import {ShopService} from "../../../../core/services/items/shop.service";
import {ShopItemDetailI} from "../../../../shared/models/items/shopitem";
import {IProductItem} from "../../../../shared/models/items/products/products";
import {IItem} from "../../../../shared/models/items/IItem";

@Component({
  selector: 'app-shop-detail',
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
  isCartFilled: boolean = this.cartService.hasTransactions()
  // Event Info and Deco
  shopItem$?: Observable<ShopItemDetailI>;
  shopError$!: Observable<any>;
  products$: Observable<IProductItem[]> = of([])

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.router.navigateByUrl('/shop')
      return
    }

    // Setup event observable and color observables
    this.Setup(id);
  }

  public Setup(id: string) {
    this.shopItem$ = this.shopService.getShopItem(id);
    this.shopError$ = this.shopItem$.pipe(
      ignoreElements(),
      catchError((err) => {
        this.router.navigateByUrl('/home')
        return of(err);
      }))
    this.products$ = this.productService.getProducts(id).pipe(shareReplay());
  }

  GetCurrentProductCount(item: IItem, product: IProductItem): number {
    return this.cartService.getProductCount(item, product)
  }
  SetProductCount(item: IItem, product: IProductItem, count: number) {
    this.cartService.setProductCount(item, product, count);
    this.isCartFilled = this.cartService.hasTransactions()
  }

  ToCheckout() {
    if (!this.isCartFilled) {
      return
    }
    this.router.navigateByUrl('/shop/checkout')
  }
}
