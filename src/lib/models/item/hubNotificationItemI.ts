import type { ItemI } from '$lib/models/item/itemI.ts';

export interface NotificationItemInI {
  derived_type_enum: string
  notification_topic: string;
}

export interface NotificationItemI {
  derived_type_enum: string
  notification_topic: string;
}

export interface NotificationItemWideI {
  item: ItemI
  derived_type: NotificationItemI
}

export interface NotificationItemLimitedI {
  derived_type_enum: string
  notification_topic: string
  default_subscription: boolean
}
