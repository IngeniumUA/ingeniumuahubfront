import {DisplayCompositionI} from "@ingenium/app/shared/models/item/display_composition";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";

export interface CardItemLimitedI {
  derived_type_enum: "carditem"
  display: DisplayCompositionI

}

export interface CardItemI {
  derived_type_enum: "carditem"

  source_item_id: number
  member_type: number
  card_type: number

  card_uuid: string
  user_uuid: string
  user_email: string

  display: DisplayCompositionI
}

export interface CardItemWideI {
  item: ItemI
  derived_type: CardItemI
}
