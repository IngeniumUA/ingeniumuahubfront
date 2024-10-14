export interface IProductCategorie {
  categorie_name: string,
  product_groups: IProductGroup[],
}

export interface IProductGroup {
  group_name: string,
  products: IProductItem[];
}

export interface CheckoutTrackerConfigI {
  status_queue: number[]
  disabled_on_status: number
}

export interface UponCompletionMetaI {
  track_checkout: CheckoutTrackerConfigI | null
}

export interface ProductMetaI {
  group: string;
  categorie: string; // Food / drinks
  upon_completion: UponCompletionMetaI | null;
  other_meta_data: {[key:string]:string};
}

export interface IPricePolicy {
  id: number;
  name: string | null;
  price: number,
  availability: {
    available: boolean;
    disabled: boolean;
  }
}

export interface IProductItem {
  id: number;
  name: string;
  description: string;
  ordering: number;
  blueprint_id: number;
  origin_item_id: number;
  date_generated: string;
  price_policy: IPricePolicy;
  note: string|null;
  max_count: number;
  product_meta: ProductMetaI;
}

export enum PaymentProviderEnum {
  Dev = 1,
  Kassa = 2,
  Free = 3,
  Stripe = 4,
}
