import {DisplayCompositionI} from "@ingenium/app/shared/models/item/display_composition";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";

export enum CardMembershipEnum {
  lid= 1,
  steunend = 2
}
export const CardMembershipEnumList = [
  CardMembershipEnum.lid,
  CardMembershipEnum.steunend
]

export enum CardTypeEnum {
  qr_code_v1 = 1,  // Card UUID displayed as QR-Code
  rfid_v1 = 2  // In development
}
export const CardTypeEnumList = [
  CardTypeEnum.qr_code_v1,
  CardTypeEnum.rfid_v1
]

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

export interface CardItemInI {
  source_item_id: number
  member_type: number
  card_type: number
  card_uuid: string
}
