import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {ProductCategoryI, ProductGroupI} from '@ingenium/app/shared/models/product/products';
import {ProductsService} from '@ingenium/app/core/services/coreAPI/products.service';
import {map} from 'rxjs/operators';
import {ProductsToCategoriesPipe} from '@ingenium/app/shared/pipes/product/product_to_categoriepipe.pipe';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {calcIntensity} from "@ingenium/app/shared/pipes/item/colorIntensity";


@Component({
  selector: 'app-page',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  // Layout
  isCartEmpty$: Observable<number>;
  // Event Info and Deco
  eventId!: string;
  event$!: Observable<ItemWideLimitedI>;
  eventError$!: Observable<any>;

  productCategories$!: Observable<ProductCategoryI[]>;
  currentProductCategorieIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<ProductGroupI[]>;

  constructor(private route: ActivatedRoute,
              private router: Router,
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

  getCategoryButtonStyle(isCurrentCategorie: boolean, backgroundColor: string): object {
    if (isCurrentCategorie) {
      return {'background-color': 'white', 'color': 'black', 'font-weight': 'bolder'}
    }

    return {'background-color': backgroundColor,
      'color': calcIntensity(backgroundColor) < 180 ? 'white' : 'black',
      'font-weight': 'bold'}
  }
}
