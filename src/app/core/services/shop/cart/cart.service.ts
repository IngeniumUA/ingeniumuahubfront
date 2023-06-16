import { Injectable } from '@angular/core';
import {IProductGroupInfo, IProductItem} from "../../../../shared/models/items/products/products";
import {CartSection} from "../../../../shared/models/items/products/cart";
import {IItem} from "../../../../shared/models/items/IItem";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  data: CartSection[] = []

  // Source --------------------------------
  private hasSection(source: IItem): boolean {
    const boolMap = this.data.map((cartSection) => {
      return cartSection.source_item.id === source.id;})
    return boolMap.includes(true)
  }
  private getOrCreateSection(source: IItem): CartSection {
    const boolMap = this.data.map((cartSection) => {
      return cartSection.source_item.id === source.id;})
    const sectionIndex = boolMap.indexOf(true)

    if (sectionIndex < 0) {
      const section = new CartSection(source)
      this.data.push(section)
      return section
    }
    return this.data.at(sectionIndex)!;
  }
  private setSection(cartSection: CartSection): void {
    const boolMap = this.data.map((lhs) => {
      return lhs.source_item === cartSection.source_item;})
    const sectionIndex = boolMap.indexOf(true)
    this.data[sectionIndex] = cartSection
  }

  // Public --------------------------------
  public get cartSections(): CartSection[] {return this.data}

  public getProductCount(source: IItem, group: IProductGroupInfo, product: IProductItem): number {
    const cartSection: CartSection = this.getOrCreateSection(source);
    return cartSection.getProductCount(group, product);
  }
  public setProductCount(source: IItem, group: IProductGroupInfo, product: IProductItem, count: number): void {
    if (count < 1) {this.removeProduct(source, group, product); return}

    const cartSection: CartSection = this.getOrCreateSection(source);
    cartSection.setProductCount(group, product, count);
    this.setSection(cartSection);
  }
  public removeProduct(source: IItem, group: IProductGroupInfo, product: IProductItem): void {
    if (!this.hasSection(source)) {return}

    const cartSection: CartSection = this.getOrCreateSection(source); // Will never be created because of guard above
    cartSection.deleteProduct(group, product);
    this.setSection(cartSection);
  }
}
