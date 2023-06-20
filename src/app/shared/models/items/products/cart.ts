import {IProductGroupInfo, IProductItem} from "./products";
import {IItem} from "../IItem";

export interface ITransaction {
  source_item: IItem
  product_group_info: IProductGroupInfo
  product: IProductItem
  count: number
}
