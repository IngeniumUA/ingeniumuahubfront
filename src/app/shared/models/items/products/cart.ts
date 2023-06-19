import {IProductItem} from "./products";

export interface ITransaction {
  sourceItemName: string
  productGroupName: string
  product: IProductItem
  count: number
}
