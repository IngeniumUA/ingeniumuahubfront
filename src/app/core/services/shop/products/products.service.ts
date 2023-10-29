import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {IProductCategorie, IProductItem} from "../../../../shared/models/items/products/products";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../environments/environment";

/*
const TESTpopUpZ: IProductGroup[] = [
  { groupinfo:
      {name: "Food & Drinks"},
    products: [
      {'name': "Bryan's Special", 'max_count': 5, 'price_eu': 3.5},
      {'name': 'Lauwe Cara', 'max_count': 5, 'price_eu': 0.5}]},
  { groupinfo:
      {name: "Tickets"},
    products: [
      {'name': "Niet-lid", 'max_count': 1, 'price_eu': 5.0}]}
]
*/
const TESTpitch = [
  {
    categorie_name: "Tickets",
    product_groups: [
      {
        group_name: "Leden:",
        products: [{'name': "FTI", 'max_count': 1, 'price_eu': 8.0}]
      }
    ]
  },
  {
    categorie_name: "Food & Drinks",
    product_groups: [
      {
        group_name: "Drinks",
        products: [
          {'name': "Cola", 'max_count': 15, 'price_eu': 2.0},
          {'name': "Fanta", 'max_count': 5, 'price_eu': 2.0},
        ]
      },
      {
        group_name: "Food",
        products: [
          {'name': "Broodje Kaas", 'max_count': 5, 'price_eu': 2.5},
          {'name': "Broodje Hesp & Kaas", 'max_count': 5, 'price_eu': 3.0},
        ]
      },
    ]
  },
  {
    categorie_name: "Extra's",
    product_groups: [
      {
        group_name: "Hey :)",
        products: [{'name': "Boop", 'max_count': 1, 'price_eu': 0.0}]
      }
    ]
  },
]

const TESTding = [
{ groupinfo:
  { name: "TEST"},
    products: [{'name': "TEST", 'max_count': 1, 'price_eu': 1.0}]}
]

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private httpClient: HttpClient) { }

  getProducts(itemID: string): Observable<IProductItem[]> {
    return this.httpClient.get<IProductItem[]>(apiEnviroment.apiUrl + "interact/product/" + itemID)
  }

  getProductWithCart(itemId: string): Observable<IProductCategorie[]> {
    // TODO return this.httpClient.post<IProductCategorie[]>(apiEnviroment.apiUrl + "interact/product/" + itemID)
    return of([])
  }
}
