import {afterNextRender, Injectable} from '@angular/core';
import {IProductItem, ProductMetaI} from '../../../../shared/models/items/products/products';
import {ITransaction} from '../../../../shared/models/items/products/cart';
import {HttpErrorResponse} from '@angular/common/http';
import {ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";

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
  sourceArray: ItemLimitedI[] = [];
  paymentErrorArray: HttpErrorResponse[] = [];

  // Initialization --------------------------------
  constructor() {
    afterNextRender(() => {
      if (window.localStorage.getItem('sources') !== null) {
        this.sourceArray = JSON.parse(window.localStorage.getItem('sources') as string);
      }
      if (window.localStorage.getItem('transactions') !== null) {
        this.transactionArray = JSON.parse(window.localStorage.getItem('transactions') as string);
      }
    });
  }

  // Private --------------------------------
  // Transaction methods
  private sort(): void {
    this.transactionArray.sort((lhs, rhs) => {
      if (lhs.sourceItemName < rhs.sourceItemName) return -1;
      if (lhs.sourceItemName > rhs.sourceItemName) return 1;

      return 0;
    });
  }
  private transactionsIncludes(source: ItemLimitedI, product?: IProductItem): boolean {
    const boolMap = this.transactionArray.map((value) => {
      const sourceEquality = value.sourceItemName === source.name;

      if (product === undefined) return sourceEquality;

      return false;

      /*return sourceEquality &&
        (value.product.name === product.name) &&
        (value.product.price_eu === product.price_eu) &&
        (value.product_meta.popupz_opties === product.product_meta.popupz_opties);*/
    });

    return boolMap.includes(true);
  }
  private getTransactionIndex(_source: ItemLimitedI, _product: IProductItem): number {
    const boolMap = this.transactionArray.map(_value => {
      return false;

      /*return (value.sourceItemName === source.name) &&
        (value.product.name === product.name) &&
        (value.product.price_eu === product.price_eu) &&
        (value.product_meta.popupz_opties === product.product_meta.popupz_opties);*/
    });

    return boolMap.indexOf(true);
  }

  private addIfMissing(source: ItemLimitedI): void {
    // Match on item.uuid instead of item because .includes doesn't catch it otherwise
    if (!this.sourceArray.map((item) => item.id).includes(source.id)) {
      this.sourceArray.push(source);
      this.updateLocalStorage();
      return;
    }
  }

  // Private Abstraction str <=> Interface methods
  private abstractToTransaction(abstract: IAbstractTransaction): ITransaction {
    return {
      source_item: this.getSource(abstract.sourceItemName),
      product: abstract.product,
      count: abstract.count
    };
  }

  getSource(source_name: string): ItemLimitedI {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source_name;});
    const sourceIndex: number = boolArray.indexOf(true);
    return this.sourceArray.at(sourceIndex)!;
  }

  private getSourceIndex(source: ItemLimitedI): number {
    const boolArray: boolean[] = this.sourceArray.map((value) => {return value.name === source.name;});
    if (boolArray.includes(true)) {
      return boolArray.indexOf(true);
    }
    return -1;
  }

  // Public --------------------------------
  public getUsedItems(): ItemLimitedI[] {
    return this.sourceArray;
  }

  public hasTransactions(): boolean {
    return this.transactionArray.length > 0;
  }

  public getCurrentTransactions(source?: ItemLimitedI, product?: IProductItem): ITransaction[] {
    const boolMap = this.transactionArray.map((value) => {
      if (source === undefined) return true;

      const sourceEquality = value.sourceItemName === source.name;

      if (product === undefined) return sourceEquality;

      return false;
      //return sourceEquality && (value.product.name === product.name) && (value.product.price_eu === product.price_eu);
    });

    let index = 0;
    const transactionIndices: number[] = [];
    boolMap.forEach((value) => {
      if (value) transactionIndices.push(index);
      index += 1;
    });

    return transactionIndices.map((transactionIndex) => {
      return this.abstractToTransaction(this.transactionArray.at(transactionIndex)!);
    });
  }

  public getProductCount(source: ItemLimitedI, product: IProductItem): number {
    if (!this.transactionsIncludes(source, product)) return 0;

    const transactionIndex = this.getTransactionIndex(source, product);
    return this.transactionArray.at(transactionIndex)!.count;
  }

  public setProductCount(source: ItemLimitedI, product: IProductItem, count: number): void {
    if (count < 1) {
      this.removeProduct(source, product);
      return;
    }

    // Adding Source and Group to seperate arrays if not already included
    this.addIfMissing(source);

    if (this.transactionsIncludes(source, product)) {
      const transactionIndex = this.getTransactionIndex(source, product);
      this.transactionArray[transactionIndex].count = count;
      this.updateLocalStorage();
      return;
    }

    /*const transaction: IAbstractTransaction = {
      sourceItemName: source.name,
      product_meta: product.product_meta,
      product: product,
      count: count
    };*/
    //this.transactionArray.push(transaction);
    this.sort();
    this.updateLocalStorage();
  }

  public removeProduct(source: ItemLimitedI, product: IProductItem): void {
    const transactionIndex = this.getTransactionIndex(source, product);
    this.transactionArray.splice(transactionIndex, 1);
    this.updateLocalStorage();

    this.clearPaymentErrors();
    if (! this.hasTransactions()) {
      this.clear();
    }

    if (this.transactionsIncludes(source)) {
      return;
    }
    // TODO Remove group

    if (this.transactionsIncludes(source)) {
      return;
    }
    // TODO Remove source
  }

  public getProductsCount(): number {
    return this.transactionArray.reduce((acc, transaction) => acc + transaction.count, 0);
  }

  public updateLocalStorage(): void {
    window.localStorage.setItem('sources', JSON.stringify(this.sourceArray));
    window.localStorage.setItem('transactions', JSON.stringify(this.transactionArray));
  }

  public clear() {
    this.transactionArray = [];
    this.sourceArray = [];
    this.paymentErrorArray = [];
    this.updateLocalStorage();
  }

  // Errors
  public getCurrentPaymentErrors(): HttpErrorResponse[] {
    return this.paymentErrorArray;
  }

  public insertPaymentError(error: HttpErrorResponse) {
    console.log(error);
    this.paymentErrorArray.push(error);
  }

  public clearPaymentErrors() {
    this.paymentErrorArray = [];
  }
}
