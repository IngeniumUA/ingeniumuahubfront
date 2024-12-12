import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, ignoreElements, Observable, of, shareReplay} from 'rxjs';
import {ProductCategoryI, ProductGroupI} from '@ingenium/app/shared/models/product/products';
import {ProductsService} from '@ingenium/app/core/services/coreAPI/products.service';
import {map} from 'rxjs/operators';
import {ProductsToCategoriesPipe} from '@ingenium/app/shared/pipes/product/product_to_categoriepipe.pipe';
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {Store} from "@ngxs/store";
import {CartState} from "@ingenium/app/core/store";
import {calcIntensity} from "@ingenium/app/shared/pipes/item/colorIntensity";
import {LayoutService} from "@ingenium/app/core/services/layout/layout.service";
import {HttpState} from "@ingenium/app/shared/models/httpState";


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
  eventResponse$!: Observable<HttpState<ItemWideLimitedI>>;
  eventError$!: Observable<any>;

  productCategories$!: Observable<ProductCategoryI[]>;
  currentProductCategoryIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<ProductGroupI[]>;

  constructor(private eventService: EventService,
              private productService: ProductsService,
              protected layoutService: LayoutService,
              store: Store,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.isCartEmpty$ = store.select(CartState.getProductCount);
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    // Fetch ID
    const thisUrl: string = currentPage
    let id: string | null = thisUrl.replace("sub/event/", "").replace("sub/events/", "")
    id = encodeURIComponent(id)
    if (id === thisUrl) {id = null}

    // If ID is null
    if (id === null) {
      this.gotoPage('sub/events')
      return;
    }

    // Setup event observable and color observables
    this.setEvent(id);

    // Setup product table
    const product_to_categorie = new ProductsToCategoriesPipe();
    this.productCategories$ = this.productService.getProducts(id).pipe(
      map(productArray => product_to_categorie.transform(productArray)),
      shareReplay()
    );
    this.setProductCategory(0);
  }

  setEvent(id: string): void {
    this.eventId = id;
    this.eventResponse$ = this.eventService.getEvent(id).pipe();
    this.eventError$ = this.eventResponse$.pipe(
      ignoreElements(),
      catchError((err) => {
        this.gotoPage('sub/event')
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

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
