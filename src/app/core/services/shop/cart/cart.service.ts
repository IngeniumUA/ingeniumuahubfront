import { Injectable } from '@angular/core';
import {IProductGroupInfo, IProductItem} from "../../../../shared/models/items/products/products";
import {CartSection} from "../../../../shared/models/items/products/cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  data: CartSection[] = []

  // Source --------------------------------
  private getOrCreateSection(source: string): CartSection {
    const boolMap = this.data.map((cartSection) => {
      return cartSection.source_uuid == source;})
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
      return lhs.source_uuid == cartSection.source_uuid;})
    const sectionIndex = boolMap.indexOf(true)
    this.data[sectionIndex] = cartSection
  }

  // Public --------------------------------
  public get cartSections(): CartSection[] {return this.data}
  public setProductCount(source: string, group: IProductGroupInfo, product: IProductItem, count: number): void {
    const cartSection: CartSection = this.getOrCreateSection(source);
    cartSection.setProductCount(group, product, count);
    this.setSection(cartSection);

    console.log(JSON.stringify(this.cartSections[0]))
  }

  public getProductCount(source: string, group: IProductGroupInfo, product: IProductItem): number {
    const cartSection: CartSection = this.getOrCreateSection(source);
    return cartSection.getProductCount(group, product);
  }
}
