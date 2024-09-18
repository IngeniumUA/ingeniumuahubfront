import {
  AvailabilityCompositionI,
  AvailabilityCompositionInI
} from "@ingenium/app/shared/models/item/availability_composition";

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

export interface ItemI {
  id: number
  name: string
  description: string

  availability: AvailabilityCompositionI

  created_timestamp: string
  last_update_timestamp: string
}
