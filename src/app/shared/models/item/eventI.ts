import {DisplayCompositionI} from "@ingenium/app/shared/models/item/display_composition";

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
}
