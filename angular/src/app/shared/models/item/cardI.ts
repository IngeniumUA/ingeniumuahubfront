import {DisplayCompositionI} from "@ingenium/app/shared/models/item/displayCompositionI";
import {ItemI, ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";

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

  source_item_name: string
  source_item_id: number

  card_uuid: string
  user_uuid: string | null
  user_email: string | null

  member_type: CardMembershipEnum
  card_type: CardTypeEnum

  display: DisplayCompositionI

}

export interface CardItemI {
  derived_type_enum: "carditem"

  source_item_id: number
  source_item_name: string

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
  derived_type_enum: "carditem"
  source_item_id: number
  member_type: number
  card_type: number
  card_uuid: string
}

export interface CardItemWideLimitedI {
  item: ItemLimitedI
  derived_type: CardItemLimitedI
}
