import { Injectable } from '@angular/core';
import {ProductDataI} from "../../../../shared/models/items/products";

class ProductDictionary {
  items: {[key: string]: any} = {};
  constructor() {
    this.items = {};
  }
  public has(key: string) {
    return key in this.items;
  }
  public set(key: string, value: number) {
    this.items[key] = value;
  }
  public get(key: string) {
    return this.items[key];
  }

  public add(key: string, value: number) {
    if (this.has(key)) {
      this.items[key] += value
    } else {
      this.set(key, value);
    }
    console.log(this.items)
  }
  public delete(key: string) {
    if( this.has(key) ){
      delete this.items[key]
      return true;
    }
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  productDict: ProductDictionary = new ProductDictionary();
  constructor() { }

  public setProduct(product: ProductDataI, count: number): void {
    this.productDict.set(product.name, count)
  }
  public addProduct(product: ProductDataI, count: number): void {
    this.productDict.add(product.name, count);
  }
  public subtractProduct(product: ProductDataI, count: number): void {
    this.productDict.add(product.name, -count)
  }
  public removeProduct(product: ProductDataI): void {
    this.productDict.delete(product.name);
  }
  public getProductCount(product: ProductDataI): number {
    return this.productDict.get(product.name);
  }
  public getProducts() {
    // TODO
  }
}
