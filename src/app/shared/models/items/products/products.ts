export interface IProductGroup {
  groupinfo: IProductGroupInfo
  products: IProductItem[];
}

export interface IProductGroupInfo {
  name: string;
}

export interface IProductItem {
  name: string;
  price_eu: number; // TODO Currency field?
  max_count: number;
}
