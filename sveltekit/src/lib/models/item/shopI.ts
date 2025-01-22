import {DisplayCompositionI} from "@ingenium/app/shared/models/item/displayCompositionI";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";

export interface ShopItemInI {
  derived_type_enum: "shopitem"
  display: DisplayCompositionI
}

export interface ShopItemLimitedI {
  derived_type_enum: "shopitem"
  display: DisplayCompositionI
}

export interface ShopItemI {
  derived_type_enum: "shopitem"
  display: DisplayCompositionI
}

export interface ShopItemWideI {
  item: ItemI
  derived_type: ShopItemI
}
