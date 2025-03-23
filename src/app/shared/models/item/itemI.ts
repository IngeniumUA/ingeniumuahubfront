import {
  AvailabilityCompositionI,
  AvailabilityCompositionInI
} from "@ingenium/app/shared/models/item/availabilityCompositionI";

export enum ItemTypeEnum {
  none,
  eventitem,
  shopitem,
  carditem,
  promoitem,
  linkitem,
  notificationitem
}

export const ItemTypeList = [
  ItemTypeEnum.none, ItemTypeEnum.eventitem, ItemTypeEnum.shopitem, ItemTypeEnum.carditem, ItemTypeEnum.linkitem, ItemTypeEnum.promoitem, ItemTypeEnum.notificationitem
]

export interface ItemLimitedInI {
  name: string
  description: string
}

export interface ItemLimitedI {
  id: number
  name: string
  description: string
}

export interface ItemInI {
  name: string
  description: string

  availability: AvailabilityCompositionInI | null
}

export interface ItemStripeConfiguration {
  // For products generated by product blueprints with this item as origin ID
  // If they are purchased through stripe, will end up on this connected account's bank account
  // Optional fee is included
  connected_account_id: string | null
  application_fee_amount: string | null
}

export interface ItemPaymentConfiguration {
  stripe_payment_configuration: ItemStripeConfiguration
}

export interface ItemSocialMediaConfiguration {
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
}

export interface ItemMetaDataI {
  payment_configuration: ItemPaymentConfiguration
  social_media_configuration: ItemSocialMediaConfiguration
}

export interface ItemI {
  id: number
  name: string
  description: string

  item_metadata: ItemMetaDataI
  availability: AvailabilityCompositionI

  created_timestamp: string
  last_update_timestamp: string
}
