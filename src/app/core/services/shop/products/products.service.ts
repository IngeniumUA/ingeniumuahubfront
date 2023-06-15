import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {IProductGroup} from "../../../../shared/models/items/products/products";

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

const TESTpitch = [
{ groupinfo:
  {name: "Tickets"},
    products: [{'name': "FTI", 'max_count': 1, 'price_eu': 0.0}]}
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

  constructor() { }

  getProducts(itemID: string): Observable<IProductGroup[]> {
    console.log(itemID)
    if (itemID === "e5b60c84-4b52-4b26-b3aa-124da4275726") {
      return of(TESTpopUpZ)
    } else if (itemID === "01719cdb-433f-4875-97c4-85fa09155553") {
      return of(TESTpitch)
    }
    return of(TESTding)
  }
}
