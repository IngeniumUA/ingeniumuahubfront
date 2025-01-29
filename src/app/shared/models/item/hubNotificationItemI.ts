import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {DisplayCompositionI} from "@ingenium/app/shared/models/item/displayCompositionI";

export function isNotificationItem(object: any): object is NotificationItemI {
  return object.derived_type_enum === "notificationitem";
}

export interface NotificationItemInI {
  derived_type_enum: string
  notification_topic: string
  default_subscription: boolean
}

export interface NotificationItemI {
  derived_type_enum: string
  notification_topic: string
  default_subscription: boolean
  notification_template: object | null // TODO -> object specified as firebase Message interface type
}

export interface NotificationItemLimitedI {
  derived_type_enum: string
  notification_topic: string
  default_subscription: boolean
  display: DisplayCompositionI  // TODO Fix warcrime
}

export interface NotificationItemWideI {
  item: ItemI
  derived_type: NotificationItemI
}
