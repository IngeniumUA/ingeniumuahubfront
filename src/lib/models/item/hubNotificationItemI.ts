import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {EventItemI} from "@ingenium/app/shared/models/item/eventI";

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
