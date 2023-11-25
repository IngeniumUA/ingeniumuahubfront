import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EventItemDetailI} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/items/events/event.service";
import {BehaviorSubject, catchError, ignoreElements, Observable, of, shareReplay, tap} from "rxjs";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {IProductCategorie, IProductGroup, IProductItem} from "../../../../shared/models/items/products/products";
import {ProductsService} from "../../../../core/services/shop/products/products.service";
import {map} from "rxjs/operators";
import {ItemI} from "../../../../shared/models/items/ItemI";
import {CartService} from "../../../../core/services/shop/cart/cart.service";
import {ProductsToCategoriesPipe} from "../../../../shared/pipes/product/product_to_categoriepipe.pipe";


@Component({
  selector: 'app-event',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private router: Router,
              private layoutService: LayoutService,
              private eventService: EventService,
              private cartService: CartService,
              private productService: ProductsService) {
  }
  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  isCartEmpty: boolean = !this.cartService.hasTransactions()
  // Event Info and Deco
  event$!: Observable<EventItemDetailI>;
  eventError$!: Observable<any>;

  productCategories$!: Observable<IProductCategorie[]>;
  currentProductCategorieIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<IProductGroup[]>;

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.router.navigateByUrl('/events')
      return
    }

    // Setup event observable and color observables
    this.SetEvent(id);

    // Setup producttable
    const product_to_categorie = new ProductsToCategoriesPipe()
    this.productCategories$ = this.productService.getProducts(id).pipe(
      map(productArray => product_to_categorie.transform(productArray)),
      shareReplay()
    )
    //this.productCategories$ = of([]) // this.productService.getProducts(id).pipe(shareReplay()); // https://blog.angular-university.io/angular-2-rxjs-common-pitfalls/
    this.SetProductCategorie(0)
  }

  SetEvent(id: string): void {
    this.event$ = this.eventService.getEvent(id).pipe()
    this.eventError$ = this.event$.pipe(
      ignoreElements(),
      catchError((err) => {
        this.router.navigateByUrl('/home')
        return of(err);
      }))
  }

  SetProductCategorie(index: number): void {
    this.currentProductGroups = this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategorieIndex$.value].product_groups
    }))
    this.currentProductCategorieIndex$.next(index)
  }
  currentCategorie$(): Observable<string | null> {
    return this.productCategories$.pipe(map((productGroups) => {
      if (productGroups.length == 0) {
        return null
      }
      return productGroups[this.currentProductCategorieIndex$.value].categorie_name
    }))
  }

  GetCurrentProductCount(item: ItemI, categorie_name: string, product: IProductItem): number {
    return this.cartService.getProductCount(item, product)
  }
  SetProductCount(item: ItemI, categorie_name: string, product: IProductItem, count: number) {
    this.cartService.setProductCount(item, product, count);
    this.isCartEmpty = this.cartService.hasTransactions()
  }

  protected readonly tap = tap;
}
