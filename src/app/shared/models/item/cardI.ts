import {DisplayCompositionI} from "@ingenium/app/shared/models/item/display_composition";

export interface CardItemLimitedI {
  derived_type_enum: "carditem"
  display: DisplayCompositionI

}

export interface CardItemI {
  derived_type_enum: "carditem"
  display: DisplayCompositionI

  card_uuid: string
  card_type: string
  member_type: string
}
