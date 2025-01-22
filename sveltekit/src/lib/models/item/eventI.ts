import type {DisplayCompositionI} from "$lib/models/item/displayCompositionI";
import type {ItemI} from "$lib/models/item/itemI";

export function isEventItem(object: any): object is EventItemI {
  return object.derived_type_enum === "eventitem";
}

export interface EventItemInI {
  derived_type_enum: "eventitem"
  display: DisplayCompositionI
  event_start: string
  event_end: string
}

export interface EventItemLimitedI {
  derived_type_enum: "eventitem"
  display: DisplayCompositionI
  event_start: string
  event_end: string
}

export interface EventItemI {
  derived_type_enum: "eventitem"
  display: DisplayCompositionI
  event_start: string
  event_end: string
  event_metadata: any
}

export interface EventItemWideI {
  item: ItemI
  derived_type: EventItemI
}
