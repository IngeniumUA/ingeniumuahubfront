import {Injectable} from '@angular/core';
import {IProductItem} from "../../../../shared/models/items/products/products";
import {IItem} from "../../../../shared/models/items/IItem";
import {ITransaction} from "../../../../shared/models/items/products/cart";

interface IAbstractTransaction {
  sourceItemName: string  // TODO Change to source item_id
  product_group_name: string
  product: IProductItem
  count: number
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  transactionArray: IAbstractTransaction[] = [];

  sourceArray: IItem[] = [];
  groupArray: string[][] = [];

  // Private --------------------------------
  // Transaction methods
  private sort(): void {
    this.transactionArray.sort((lhs, rhs) => {
      if (lhs.sourceItemName < rhs.sourceItemName) return -1
      if (lhs.sourceItemName > rhs.sourceItemName) return 1

      if (lhs.product_group_name < rhs.product_group_name) return -1
      if (lhs.product_group_name > rhs.product_group_name) return 1

      return 0
    })
  }
  private transactionsIncludes(source: IItem, group?: string, product?: IProductItem): boolean {
    const boolMap = this.transactionArray.map((value) => {
      const sourceEquality = value.sourceItemName === source.name
      if (group === undefined) return sourceEquality

      const groupEquality = value.product_group_name === group
      if (product === undefined) return sourceEquality && groupEquality

      return sourceEquality && groupEquality && (value.product.name === product.name)
    })
    return boolMap.includes(true);
  }
  private getTransactionIndex(source: IItem, group: string, product: IProductItem): number {
    const boolMap = this.transactionArray.map(value => {
      return value.sourceItemName === source.name && value.product_group_name === group && value.product === product
    })
    return boolMap.indexOf(true);
  }

  private addIfMissing(source: IItem, group: string): void {
    if (!this.sourceArray.includes(source)) {
      this.sourceArray.push(source);
      this.groupArray.push([group]);
      return
    }

    const sourceIndex = this.getSourceIndex(source)
    const groupArray: string[] = this.groupArray.at(sourceIndex)!
    if (!groupArray.includes(group)) {
      groupArray.push(group)
      this.groupArray[sourceIndex] = groupArray
    }
  }

  // Private Abstraction str <=> Interface methods
  private abstractToTransaction(abstract: IAbstractTransaction): ITransaction {
    return {
      source_item: this.getSource(abstract.sourceItemName),
      categorie_name: this.getGroup(abstract.sourceItemName, abstract.product_group_name),
      product: abstract.product,
      count: abstract.count
    }
  }
  getSource(source_name: string): IItem {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source_name})
    const sourceIndex: number = boolArray.indexOf(true)
    return this.sourceArray.at(sourceIndex)!
  }
  getGroup(source_name: string, group_name: string): string {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source_name})
    const sourceIndex: number = boolArray.indexOf(true)

    const groupArray: string[] = this.groupArray.at(sourceIndex)!
    const boolMap: boolean[] = groupArray.map((value) => {return value === group_name})

    return groupArray.at(boolMap.indexOf(true))!
  }

  private getSourceIndex(source: IItem): number {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source.name})
    if (boolArray.includes(true)) {
      return boolArray.indexOf(true)
    }
    return -1
  }

  // Public --------------------------------
  public getUsedItems(): IItem[] {
    return this.sourceArray
  }

  public getCurrentTransactions(source?: IItem, group?: string, product?: IProductItem): ITransaction[] {
    const boolMap = this.transactionArray.map((value) => {
      if (source === undefined) return true

      const sourceEquality = value.sourceItemName === source.name
      if (group === undefined) return sourceEquality

      const groupEquality = value.product_group_name === group
      if (product === undefined) return sourceEquality && groupEquality

      return sourceEquality && groupEquality && (value.product.name === product.name)
    })

    let index = 0;
    const transactionIndices: number[] = []
    boolMap.forEach((value) => {
      if (value) transactionIndices.push(index)
      index += 1
    })

    return transactionIndices.map((transactionIndex) => {
      return this.abstractToTransaction(this.transactionArray.at(transactionIndex)!)
    })
  }

  public getProductCount(source: IItem, group: string, product: IProductItem): number {
    if (!this.transactionsIncludes(source, group, product)) {return 0}

    const transactionIndex = this.getTransactionIndex(source, group, product);
    return this.transactionArray.at(transactionIndex)!.count
  }
  public setProductCount(source: IItem, group: string, product: IProductItem, count: number): void {
    if (count < 1) {this.removeProduct(source, group, product); return}

    // Adding Source and Group to seperate arrays if not already included
    this.addIfMissing(source, group)

    if (this.transactionsIncludes(source, group, product)) {
      const transactionIndex = this.getTransactionIndex(source, group, product)
      this.transactionArray[transactionIndex].count = count
      return;
    }

    const transaction: IAbstractTransaction = {
      sourceItemName: source.name,
      product_group_name: group,
      product: product,
      count: count
    }
    this.transactionArray.push(transaction)
    this.sort()
  }
  public removeProduct(source: IItem, group: string, product: IProductItem): void {
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
