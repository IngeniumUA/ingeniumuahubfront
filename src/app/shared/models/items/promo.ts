import {ItemI} from './ItemI';

export interface PromoI {
  item: ItemI;
  display_from_date: string;
  display_until_date: string;
  type: string;
  color: string;
  follow_through_link: string;
  image_square: string;
  image_landscape: string;
}

export interface PromoType {
  name: string;
  value: number
}

export const PromoTypes: PromoType[] = [
  {name: 'vacature', value: 1}
];
