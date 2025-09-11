import type { AvailabilityCompositionI, AvailabilityCompositionInI } from '$lib/models/item/availabilityCompositionI';


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

export interface SocialMediaConfigurationI {
  facebook_url: string | null,
  instagram_url: string | null,
  linkedin_url: string | null,
}

export interface PaymentConfigurationI {
  stripe_payment_configuration: null | Record<string, string | number | null>
}

export interface ItemMetaDataI {
  social_media_configuration: SocialMediaConfigurationI | null;
  payment_configuration: PaymentConfigurationI | null
}

export interface ItemI {
  id: number
  name: string
  description: string

  availability: AvailabilityCompositionI
  item_metadata: ItemMetaDataI

  created_timestamp: string
  last_update_timestamp: string
}
