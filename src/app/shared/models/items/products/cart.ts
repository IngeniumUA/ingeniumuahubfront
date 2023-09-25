import {IProductItem} from "./products";
import {IItem} from "../IItem";

export interface ITransaction {
  source_item: IItem
  product: IProductItem
  count: number
}
