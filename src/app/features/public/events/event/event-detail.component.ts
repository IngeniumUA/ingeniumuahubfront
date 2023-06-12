import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventItemI} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/events/event.service";
import {BehaviorSubject, Observable, of, tap} from "rxjs";
import {LayoutService} from "../../../../core/services/layout/layout.service";
import {ProductDataI} from "../../../../shared/models/items/products";

const TESTgetCategorieNames$: string[] = [
  "Tickets",
  "Products",
  "Dummy"
]
const TESTgetTicketData$: ProductDataI[] = [
  {'name': 'Ticketjeuh', 'max_count': 0, 'price_eu': 3.0},
  {'name': 'Ticketja', 'max_count': 0, 'price_eu': 1.0},
  {'name': 'Ticketnee', 'max_count': 0, 'price_eu': 0.0}
]
const TESTgetProductData$: ProductDataI[] = [
  {'name': 'Productjeuh', 'max_count': 0, 'price_eu': 0.0},
  {'name': 'Productja', 'max_count': 0, 'price_eu': 420.0},
  {'name': 'Productnee', 'max_count': 0, 'price_eu': 0.0}
]
const TESTgetDummyData$: ProductDataI[] = [
  {'name': 'Dummyjeuh', 'max_count': 0, 'price_eu': 0.0},
  {'name': 'Dummyja', 'max_count': 0, 'price_eu': 0.0},
  {'name': 'Dummynee', 'max_count': 0, 'price_eu': 69.0}
]

@Component({
  selector: 'app-event',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private elementRef: ElementRef,
              private layoutService: LayoutService,
              private eventService: EventService) {
  }
  // Layout
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  // Event Info and Deco
  event$?: Observable<EventItemI>;
  primaryColor90!: string;
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

    // Setup products
    this.SetupProducts(id);
  }

  SetEvent(id: string): void {
    this.event$ = this.eventService.getEvent(id).pipe(
      tap((event: EventItemI) => {
        const primaryBackground = "rgba("
          + event.main_color.substring(0, 3) + ", "
          + event.main_color.substring(3, 6) + ", "
          + event.main_color.substring(6, 9)

        this.primaryColor90 = primaryBackground + ", 0.9)";
        this.primaryColorFull = primaryBackground + ")";
      })
    );
  }

  // Products
  categorieNames$?: Observable<string[]>;
  currentCategorie$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  categorieData$?: Observable<ProductDataI[]>;

  SetupProducts(id: string): void {
    // Setup method called once at the start ( .. maybe move this to ngoninit?)
    this.categorieNames$ = of(TESTgetCategorieNames$)

    this.SetCategorie(0);
  }

  SetCategorie(index: number): void {
    this.currentCategorie$.next(index);

    if (index === 0) {
      this.categorieData$ = of(TESTgetTicketData$)
    } else if (index === 1) {
      this.categorieData$ = of(TESTgetProductData$)
    } else {
      this.categorieData$ = of(TESTgetDummyData$)
    }

  }
}
