import {ItemI, ItemInI, ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";
import {PromoItemI, PromoItemInI, PromoItemLimitedI} from "@ingenium/app/shared/models/item/promoI";
import {EventItemI, EventItemInI, EventItemLimitedI} from "@ingenium/app/shared/models/item/eventI";
import {ShopItemI, ShopItemInI, ShopItemLimitedI} from "@ingenium/app/shared/models/item/shopI";
import {CardItemInI} from "@ingenium/app/shared/models/item/cardI";

export interface ItemWideLimitedI {
  item: ItemLimitedI
  derived_type: EventItemLimitedI | ShopItemLimitedI | PromoItemLimitedI
}

export interface ItemWideInI {
  item: ItemInI
  derived_type: EventItemInI | ShopItemInI | PromoItemInI | CardItemInI | null
}

export interface ItemWideI {
  item: ItemI
  derived_type: EventItemI | ShopItemI | PromoItemI
}
