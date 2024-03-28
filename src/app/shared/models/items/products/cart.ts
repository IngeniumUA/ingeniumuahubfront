import {IProductItem} from './products';
import {ItemI} from '../ItemI';

export interface ITransaction {
  source_item: ItemI
  product: IProductItem
  count: number
}
