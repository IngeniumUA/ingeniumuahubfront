import {IProductItem} from './products';
import {ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";

export interface ITransaction {
  source_item: ItemLimitedI
  product: IProductItem
  count: number
}
