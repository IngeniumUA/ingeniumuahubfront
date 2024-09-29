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
  categorie: string;
  upon_completion: UponCompletionMetaI | null;
  popupz_opties: string | null;
}

export interface IPricePolicy {
  id: number;
  name: string;
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

export interface CheckoutIdI {
  checkout_id: string
  payment_provider_payment_id: string,
  payment_provider: PaymentProviderEnum
}

export interface CheckoutResponseI {
  checkout: CheckoutIdI
}
