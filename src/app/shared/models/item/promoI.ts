import {DisplayCompositionI} from "@ingenium/app/shared/models/item/displayCompositionI";

export interface PromoType {
  name: string
  value: number
}

export const PromoItemTypes: PromoType[] = [
  {value: 1, name: 'vacature'},
];

export interface PromoItemInI {
  derived_type_enum: "promoitem"
  promo_type: string
  display: DisplayCompositionI
}

export interface PromoItemLimitedI {
  derived_type_enum: "promoitem"
  promo_type: string
  display: DisplayCompositionI
}

export interface PromoItemI {
  derived_type_enum: "promoitem"
  promo_type: string
  display: DisplayCompositionI
}
