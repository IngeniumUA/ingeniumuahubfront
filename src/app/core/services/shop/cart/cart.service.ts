import {Injectable} from '@angular/core';
import {IProductItem, ProductMetaI} from "../../../../shared/models/items/products/products";
import {IItem} from "../../../../shared/models/items/IItem";
import {ITransaction} from "../../../../shared/models/items/products/cart";

interface IAbstractTransaction {
  sourceItemName: string  // TODO Change to source item_id
  product_meta: ProductMetaI
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

      return 0
    })
  }
  private transactionsIncludes(source: IItem, product?: IProductItem): boolean {
    const boolMap = this.transactionArray.map((value) => {
      const sourceEquality = value.sourceItemName === source.name

      if (product === undefined) return sourceEquality

      return sourceEquality && (value.product.name === product.name) // TODO Product meta
    })
    return boolMap.includes(true);
  }
  private getTransactionIndex(source: IItem, product: IProductItem): number {
    const boolMap = this.transactionArray.map(value => {
      return value.sourceItemName === source.name && value.product === product
    })
    return boolMap.indexOf(true);
  }

  private addIfMissing(source: IItem): void {
    // Match on item.uuid instead of item because .includes doesn't catch it otherwise
    if (!this.sourceArray.map((item) => item.uuid).includes(source.uuid)) {
      this.sourceArray.push(source);
      return
    }
  }

  // Private Abstraction str <=> Interface methods
  private abstractToTransaction(abstract: IAbstractTransaction): ITransaction {
    return {
      source_item: this.getSource(abstract.sourceItemName),
      product: abstract.product,
      count: abstract.count
    }
  }
  getSource(source_name: string): IItem {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source_name})
    const sourceIndex: number = boolArray.indexOf(true)
    return this.sourceArray.at(sourceIndex)!
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

  public hasTransactions(): boolean {
    return this.transactionArray.length > 0
  }

  public getCurrentTransactions(source?: IItem, product?: IProductItem): ITransaction[] {
    const boolMap = this.transactionArray.map((value) => {
      if (source === undefined) return true

      const sourceEquality = value.sourceItemName === source.name

      if (product === undefined) return sourceEquality

      return sourceEquality && (value.product.name === product.name)
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

  public getProductCount(source: IItem, product: IProductItem): number {
    if (!this.transactionsIncludes(source, product)) {return 0}

    const transactionIndex = this.getTransactionIndex(source, product);
    return this.transactionArray.at(transactionIndex)!.count
  }
  public setProductCount(source: IItem, product: IProductItem, count: number): void {
    if (count < 1) {this.removeProduct(source, product); return}

    // Adding Source and Group to seperate arrays if not already included
    this.addIfMissing(source)

    if (this.transactionsIncludes(source, product)) {
      const transactionIndex = this.getTransactionIndex(source, product)
      this.transactionArray[transactionIndex].count = count
      return;
    }

    const transaction: IAbstractTransaction = {
      sourceItemName: source.name,
      product_meta: product.product_meta,
      product: product,
      count: count
    }
    this.transactionArray.push(transaction)
    this.sort()
  }
  public removeProduct(source: IItem, product: IProductItem): void {
    const transactionIndex = this.getTransactionIndex(source, product)
    this.transactionArray.splice(transactionIndex, 1)

    if (this.transactionsIncludes(source)) {
      return
    }
    // TODO Remove group

    if (this.transactionsIncludes(source)) {
      return;
    }
    // TODO Remove source
  }
}
