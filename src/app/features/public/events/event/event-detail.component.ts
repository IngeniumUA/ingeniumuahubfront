import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {IProductCategorie, IProductGroup} from '@ingenium/app/shared/models/items/products/products';
import {ProductsService} from '@ingenium/app/core/services/shop/products/products.service';
import {map} from 'rxjs/operators';
import {ProductsToCategoriesPipe} from '@ingenium/app/shared/pipes/product/product_to_categoriepipe.pipe';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";


@Component({
  selector: 'app-page',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  isCartEmpty$: Observable<number>;
  // Event Info and Deco
  eventId!: string;
  event$!: Observable<ItemWideLimitedI>;
  eventError$!: Observable<any>;

  productCategories$!: Observable<IProductCategorie[]>;
  currentProductCategorieIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<IProductGroup[]>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private layoutService: LayoutService,
              private eventService: EventService,
              private productService: ProductsService,
              store: Store) {
    this.isCartEmpty$ = store.select(CartState.getProductCount);
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      this.router.navigateByUrl('/events');
      return;
    }

    // Setup event observable and color observables
    this.SetEvent(id);

    // Setup producttable
    const product_to_categorie = new ProductsToCategoriesPipe();
    this.productCategories$ = this.productService.getProducts(id).pipe(
      map(productArray => product_to_categorie.transform(productArray)),
      shareReplay()
    );
    //this.productCategories$ = of([]) // this.productService.getProducts(id).pipe(shareReplay()); // https://blog.angular-university.io/angular-2-rxjs-common-pitfalls/
    this.SetProductCategorie(0);
  }

  SetEvent(id: string): void {
    this.eventId = id;
    this.event$ = this.eventService.getEvent(id).pipe();
    this.eventError$ = this.event$.pipe(
      ignoreElements(),
      catchError((err) => {
        this.router.navigateByUrl('/event');
        return of(err);
      }));
  }

  SetProductCategorie(index: number): void {
    this.currentProductGroups = this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategorieIndex$.value].product_groups;
    }));
    this.currentProductCategorieIndex$.next(index);
  }

  currentCategorie$(): Observable<string | null> {
    return this.productCategories$.pipe(map((productGroups) => {
      if (productGroups.length == 0) {
        return null;
      }
      return productGroups[this.currentProductCategorieIndex$.value].categorie_name;
    }));
  }
}
