import {ItemI} from "@ingenium/app/shared/models/item/itemI";

export interface LinkItemInI {
  derived_type_enum: string
  link_identifier: string;
  redirect_url: string | null;
}

export interface LinkItemI {
  derived_type_enum: string
  link_identifier: string;
  redirect_url: string | null;
}

export interface LinkItemWideI {
  item: ItemI
  derived_type: LinkItemI
}
