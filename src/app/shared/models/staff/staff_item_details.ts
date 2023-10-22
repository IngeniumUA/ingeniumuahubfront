import {ItemI} from "../items/ItemI";


export interface StaffItemI {
  uuid: string;
  name: string;
  description: string
  available: boolean
  disabled: boolean
  created_at: string
  modified_at: string
}

export interface StaffDisplayMixin {
  color: string

  follow_through_link: string

  image_square: string
  image_landscape: string

  preview_description: string
}

export interface StaffItemEventDetail {
  start_date: string
  end_date: string
  location: string
  display_mixin: StaffDisplayMixin
}

export interface StaffItemShopDetail {
  display_mixin: StaffDisplayMixin
}

export interface StaffItemPromoDetail {
  type: string
  display_from_date: string
  display_until_date: string
  display_mixin: StaffDisplayMixin
}

export interface StaffItemDetailI {
  item: StaffItemI,
  event_item: StaffItemEventDetail,
  shop_item: StaffItemShopDetail,
  promo_item: StaffItemPromoDetail
}
