import {ItemI, ItemInI, ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";
import {PromoItemI, PromoItemInI, PromoItemLimitedI} from "@ingenium/app/shared/models/item/promoI";
import {EventItemI, EventItemInI, EventItemLimitedI} from "@ingenium/app/shared/models/item/eventI";
import {ShopItemI, ShopItemInI, ShopItemLimitedI} from "@ingenium/app/shared/models/item/shopI";
import {CardItemI, CardItemInI} from "@ingenium/app/shared/models/item/cardI";
import {LinkItemI, LinkItemInI} from "@ingenium/app/shared/models/item/linkI";
import {NotificationItemI, NotificationItemInI} from "@ingenium/app/shared/models/item/hubNotificationItemI";

export interface ItemWideLimitedI {
  item: ItemLimitedI
  derived_type: EventItemLimitedI | ShopItemLimitedI | PromoItemLimitedI // Notification and link to be added
}

export interface ItemWideInI {
  item: ItemInI
  derived_type: EventItemInI | ShopItemInI | PromoItemInI | CardItemInI | LinkItemInI | NotificationItemInI | null
}

export interface ItemWideI {
  item: ItemI
  derived_type: EventItemI | ShopItemI | PromoItemI | CardItemI | LinkItemI | NotificationItemI
}
