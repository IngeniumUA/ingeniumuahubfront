import { Injectable } from '@angular/core';
import {IProductGroupInfo, IProductItem} from "../../../../shared/models/items/products/products";
import {IItem} from "../../../../shared/models/items/IItem";
import {ITransaction} from "../../../../shared/models/items/products/cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  transactionArray: ITransaction[] = [];

  sourceArray: IItem[] = [];
  groupArray: IProductGroupInfo[][] = [];

  // Private --------------------------------
  // Transaction methods
  private sort(): void {
    this.transactionArray.sort((lhs, rhs) => {
      if (lhs.sourceItemName < rhs.sourceItemName) return -1
      if (lhs.sourceItemName > rhs.sourceItemName) return 1

      if (lhs.productGroupName < rhs.productGroupName) return -1
      if (lhs.productGroupName > rhs.productGroupName) return 1

      return 0
    })
  }
  private transactionsIncludes(source: IItem, group?: IProductGroupInfo, product?: IProductItem): boolean {
    const boolMap = this.transactionArray.map((value) => {
      const sourceEquality = value.sourceItemName === source.name
      if (group === undefined) return sourceEquality

      const groupEquality = value.productGroupName === group.name
      if (product === undefined) return sourceEquality && groupEquality

      return sourceEquality && groupEquality && (value.product.name === product.name)
    })
    return boolMap.includes(true);
  }
  private getTransactionIndex(source: IItem, group: IProductGroupInfo, product: IProductItem): number {
    const boolMap = this.transactionArray.map(value => {
      return value.sourceItemName === source.name && value.productGroupName === group.name && value.product === product
    })
    return boolMap.indexOf(true);
  }

  // Private Abstraction str <=> Interface methods
  private getSourceIndex(source: IItem): number {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source.name})
    if (boolArray.includes(true)) {
      return boolArray.indexOf(true)
    }
    return -1
  }
  private getGroup(source: IItem, group: IProductGroupInfo): number {
    const sourceIndex = this.getSourceIndex(source)
    if (sourceIndex < -1) return -1

    const boolArray: boolean[] = this.groupArray[sourceIndex].map((value) => {return value.name === source.name})
    if (boolArray.includes(true)) {
      return boolArray.indexOf(true)
    }
    return -1 // This should never happen if service is used correctly
  }

  // Public --------------------------------
  public getTransactions(): ITransaction[] {
    return this.transactionArray
  }

  public getProductCount(source: IItem, group: IProductGroupInfo, product: IProductItem): number {
    if (!this.transactionsIncludes(source, group, product)) {return 0}

    const transactionIndex = this.getTransactionIndex(source, group, product);
    return this.transactionArray.at(transactionIndex)!.count
  }
  public setProductCount(source: IItem, group: IProductGroupInfo, product: IProductItem, count: number): void {
    if (count < 1) {this.removeProduct(source, group, product); return}

    if (this.transactionsIncludes(source, group, product)) {
      const transactionIndex = this.getTransactionIndex(source, group, product)

      this.transactionArray[transactionIndex].count = count

      return;
    }

    const transaction: ITransaction = {
      sourceItemName: source.name,
      productGroupName: group.name,
      product: product,
      count: count
    }
    this.transactionArray.push(transaction)
    this.sort()
  }
  public removeProduct(source: IItem, group: IProductGroupInfo, product: IProductItem): void {
    const transactionIndex = this.getTransactionIndex(source, group, product)
    this.transactionArray.splice(transactionIndex, 1)

    if (this.transactionsIncludes(source, group)) {
      return
    }
    // TODO Remove group

    if (this.transactionsIncludes(source)) {
      return;
    }
    // TODO Remove source
  }
}
