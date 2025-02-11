export interface ProductCategoryI {
  categorie_name: string,
  product_groups: ProductGroupI[],
}

export interface ProductGroupI {
  group_name: string,
  products: ProductOutI[];
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

export interface PricePolicyLimitedI {
  id: number;
  name: string | null;
  price: number,
  ordering: number
  availability: {
    available: boolean;
    disabled: boolean;
  }
}

export interface ProductOutI {
  id: number;
  name: string;
  description: string;
  ordering: number;
  blueprint_id: number;
  origin_item_id: number;
  date_generated: string;
  price_policy: PricePolicyLimitedI|null;
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
