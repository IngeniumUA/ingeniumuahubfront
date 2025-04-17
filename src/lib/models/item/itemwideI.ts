import type {ItemI, ItemInI, ItemLimitedI} from "$lib/models/item/itemI";
import type {EventItemI, EventItemInI, EventItemLimitedI} from "$lib/models/item/eventI";
import type {ShopItemI, ShopItemInI, ShopItemLimitedI} from "$lib/models/item/shopI";
import type {PromoItemI, PromoItemInI, PromoItemLimitedI} from "$lib/models/item/promoI";
import type {CardItemI, CardItemInI} from "$lib/models/item/cardI";
import type {LinkItemI, LinkItemInI} from "$lib/models/item/linkI";
import type {NotificationItemI, NotificationItemInI, NotificationItemLimitedI} from "$lib/models/item/hubNotificationItemI";

export interface ItemWideLimitedI {
  item: ItemLimitedI
  derived_type: EventItemLimitedI | ShopItemLimitedI | PromoItemLimitedI | NotificationItemLimitedI // Notification and link to be added
}

export interface ItemWideInI {
  item: ItemInI
  derived_type: EventItemInI | ShopItemInI | PromoItemInI | CardItemInI | LinkItemInI | NotificationItemInI | null
}

export interface ItemWideI {
  item: ItemI
  derived_type: EventItemI | ShopItemI | PromoItemI | CardItemI | LinkItemI | NotificationItemI
}
