import {IProductItem} from "./products";
import {IItem} from "../IItem";

export interface ITransaction {
  source_item: IItem
  categorie_name: string
  product: IProductItem
  count: number
}
