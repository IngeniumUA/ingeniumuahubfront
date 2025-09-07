import type { DisplayCompositionI } from '$lib/models/item/displayCompositionI';
import type { ItemI } from '$lib/models/item/itemI';


export enum PromoItemTypeEnum {
  vacature = 1
}

export const PromoItemTypes = [
  PromoItemTypeEnum.vacature
]

export interface PromoItemInI {
  derived_type_enum: "promoitem"
  promo_type: number
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

export interface PromoItemWideI {
  item: ItemI
  derived_type: PromoItemI
}
