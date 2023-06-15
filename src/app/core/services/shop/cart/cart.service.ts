import { Injectable } from '@angular/core';
import {ProductDataI} from "../../../../shared/models/items/products";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  productAndCount: Array<[ProductDataI, number]> = [];
  constructor() { }

  private get productArray() {
    return this.productAndCount.map(pair => {
      return pair.at(0)
    })
  }

  public setProduct(product: ProductDataI, count: number) {
    const productIndex = this.productArray.indexOf(product);
    if (productIndex < 0) {
      this.productAndCount.push([product, count]);
      return;
    }
    this.productAndCount[productIndex][1] = count;
  }
  public addProduct(product: ProductDataI, count: number): void {
    const productIndex = this.productArray.indexOf(product);
    if (productIndex < 0) {
      this.productAndCount.push([product, count]);
      return;
    }
    this.productAndCount[productIndex][1] += count;
  }

  public subtractProduct(product: ProductDataI, count: number): void {
    const productIndex = this.productArray.indexOf(product);
    if (productIndex < 0) {
      this.productAndCount.push([product, count]);
      return;
    }
    this.productAndCount[productIndex][1] -= count;
  }

  public removeProduct(product: ProductDataI): void {
    const productIndex = this.productArray.indexOf(product);
    if (productIndex < 0) {
      return;
    }
    this.productAndCount.splice(productIndex, 1);
  }

  public getProducts(): Array<[ProductDataI, number]> {
    return this.productAndCount
  }
}
