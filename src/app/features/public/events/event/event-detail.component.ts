import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventItemDetailI} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/items/events/event.service";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {IProductCategorie, IProductGroup, IProductItem} from "../../../../shared/models/items/products/products";
import {ProductsService} from "../../../../core/services/shop/products/products.service";
import {map} from "rxjs/operators";
import {IItem} from "../../../../shared/models/items/IItem";
import {CartService} from "../../../../core/services/shop/cart/cart.service";


@Component({
  selector: 'app-event',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private layoutService: LayoutService,
              private eventService: EventService,
              private cartService: CartService,
              private productService: ProductsService) {
  }
  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  // Event Info and Deco
  event$?: Observable<EventItemDetailI>;
  productCategories$!: Observable<IProductCategorie[]>;
  currentProductCategorieIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  currentProductGroups!: Observable<IProductGroup[]>;

  primaryColorHalf!: string;
  primaryColorFull!: string;

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      return // TODO insert not found?
    }

    // Setup event observable and color observables
    this.SetEvent(id);

    // Setup producttable
    this.productCategories$ = this.productService.getProducts(id);
    this.SetProductCategorie(0)
  }

  SetEvent(id: string): void {
    this.event$ = this.eventService.getEvent(id).pipe(
      tap((event: EventItemDetailI) => {
        const primaryBackground = "rgba("
          + event.color.substring(0, 3) + ", "
          + event.color.substring(3, 6) + ", "
          + event.color.substring(6, 9)

        this.primaryColorHalf = primaryBackground + ", 0.5)";
        this.primaryColorFull = primaryBackground + ")";
      })
    );
  }

  SetProductCategorie(index: number): void {
    this.currentProductGroups = this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategorieIndex$.value].product_groups
    }))
    this.currentProductCategorieIndex$.next(index)
  }
  currentCategorie$(): Observable<string> {
    return this.productCategories$.pipe(map((productGroups) => {
      return productGroups[this.currentProductCategorieIndex$.value].categorie_name
    }))
  }

  GetCurrentProductCount(item: IItem, categorie_name: string, product: IProductItem): number {
    return this.cartService.getProductCount(item, categorie_name, product)
  }
  SetProductCount(item: IItem, categorie_name: string, product: IProductItem, count: number) {
    this.cartService.setProductCount(item, categorie_name, product, count);
  }
}
