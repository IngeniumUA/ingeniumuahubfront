export interface IProductCategorie {
  categorie_name: string,
  product_groups: IProductGroup[],
}

export interface IProductGroup {
  group_name: string,
  products: IProductItem[];
}

export interface IProductItem {
  // TODO id: number
  name: string;
  price_eu: number; // TODO Currency field?
  max_count: number;
}
