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
  upon_completion: object[] | null;
  popupz_opties: string | null;
}

export interface IProductItem {
  id: number;
  product_blueprint_id: number;
  product_blueprint_name: string | null
  product_ordering: number
  name: string;
  price_eu: number;
  max_count: number;
  product_meta: ProductMetaI;
}
