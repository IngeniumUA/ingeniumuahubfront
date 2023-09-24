export interface IProductCategorie {
  categorie_name: string,
  product_groups: IProductGroup[],
}

export interface IProductGroup {
  group_name: string,
  products: IProductItem[];
}

export interface ProductMetaI {
  group: string;
  categorie: string;
}

export interface IProductItem {
  id: number;
  name: string;
  price_eu: number;
  max_count: number;
  product_meta: ProductMetaI;
}
