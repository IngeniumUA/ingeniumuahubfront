import {Component, Input, OnInit} from '@angular/core';
import {ProductDataI} from "../../../../models/items/products";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AsyncPipe, NgForOf, NgStyle} from "@angular/common";
import {ProductComponent} from "../product/product.component";
import {Router} from "@angular/router";
import {CartService} from "../../../../../core/services/shop/cart/cart.service";

const TESTgetCategorieNames$: string[] = [
  "Tickets",
  "Products",
  "Dummy"
]
const TESTgetTicketData$: ProductDataI[] = [
  {'name': 'Ticketjeuh', 'max_count': 5, 'price_eu': 3.0},
  {'name': 'Ticketja', 'max_count': 2, 'price_eu': 1.0},
  {'name': 'Ticketnee', 'max_count': 1, 'price_eu': 0.0}
]
const TESTgetProductData$: ProductDataI[] = [
  {'name': 'Productjeuh', 'max_count': 5, 'price_eu': 0.0},
  {'name': 'Productja', 'max_count': 2, 'price_eu': 420.0},
  {'name': 'Productnee', 'max_count': 1, 'price_eu': 0.0}
]
const TESTgetDummyData$: ProductDataI[] = [
  {'name': 'Dummyjeuh', 'max_count': 5, 'price_eu': 0.0},
  {'name': 'Dummyja', 'max_count': 2, 'price_eu': 0.0},
  {'name': 'Dummynee', 'max_count': 1, 'price_eu': 69.0}
]

@Component({
  selector: 'app-producttable',
  templateUrl: './producttable.component.html',
  styleUrls: ['./producttable.component.css'],
  imports: [
    NgStyle,
    NgForOf,
    AsyncPipe,
    ProductComponent
  ],
  standalone: true
})
export class ProducttableComponent implements OnInit {
  @Input() eventID!: string;
  @Input() primaryColorFull!: string;
  categorieNames$?: Observable<string[]>;
  currentCategorie$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  categorieData$?: Observable<ProductDataI[]>;

  constructor(private router: Router,
              private cartService: CartService) {
  }

  ngOnInit() {
    // On init select first categorie
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

  productCount: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  GetCurrentProductCount(productIndex: number): number {
    return this.productCount.at(this.currentCategorie$.value)?.at(productIndex) ?? 0
  }
  SetProductCount(productIndex: number, productCount: number) {
    this.productCount[this.currentCategorie$.value][productIndex] = productCount
  }


  RouteToCheckout(): void {


    this.router.navigate(['/shop/checkout'])
  }
}
