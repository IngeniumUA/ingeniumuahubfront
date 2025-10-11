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

export interface LocationCompositionI {
  location_display_name: string | null,
  location_search_name: string | null,
  latitude: number | null,
  longitude: number | null,
}

export interface EventItemI {
  derived_type_enum: "eventitem"
  display: DisplayCompositionI
  event_start: string
  event_end: string
  location: LocationCompositionI
  event_metadata: any
}

export interface EventItemWideI {
  item: ItemI
  derived_type: EventItemI
}
