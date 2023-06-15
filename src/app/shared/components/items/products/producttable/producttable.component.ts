import {Component, Input, OnInit} from '@angular/core';
import {IProductGroup, IProductGroupInfo, IProductItem} from "../../../../models/items/products/products";
import {BehaviorSubject, Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {ProductComponent} from "../product/product.component";
import {Router} from "@angular/router";
import {CartService} from "../../../../../core/services/shop/cart/cart.service";
import {ProductsService} from "../../../../../core/services/shop/products/products.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-producttable',
  templateUrl: './producttable.component.html',
  styleUrls: ['./producttable.component.css'],
  imports: [
    NgStyle,
    NgForOf,
    AsyncPipe,
    ProductComponent,
    NgIf
  ],
  standalone: true
})
export class ProducttableComponent implements OnInit {
  @Input() eventID!: string;
  @Input() primaryColorFull!: string;
  productGroups$!: Observable<IProductGroup[]>;
  currentProductGroupIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  products$!: Observable<IProductItem[]>;

  constructor(private router: Router,
              private productService: ProductsService,
              private cartService: CartService) {
  }

  ngOnInit() {
    // On init select first categorie

    this.productGroups$ = this.productService.getProducts(this.eventID);
    this.SetProductGroup(0)
  }

  SetProductGroup(index: number): void {
    this.products$ = this.productGroups$.pipe(map((productGroups) => {
      return productGroups[this.currentProductGroupIndex$.value].products
    }))
    this.currentProductGroupIndex$.next(index)
  }
  currentGroup$(): Observable<IProductGroupInfo> {
    return this.productGroups$.pipe(map((productGroups) => {
      return productGroups[this.currentProductGroupIndex$.value].groupinfo
    }))
  }

  GetCurrentProductCount(groupinfo: IProductGroupInfo, product: IProductItem): number {
    return this.cartService.getProductCount(this.eventID, groupinfo, product)
  }
  SetProductCount(groupinfo: IProductGroupInfo, product: IProductItem, count: number) {
    this.cartService.setProductCount(this.eventID, groupinfo, product, count);
  }

  RouteToCheckout(): void {
    this.router.navigate(['/shop/checkout'])
  }
}
