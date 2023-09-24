import {IItem} from "./IItem";
export interface EventItemDetailI {  item: IItem;
  start_date: string;
  end_date: string;
  location: string;  // TODO Location Object, package maybe?
  follow_through_link: string;
  color: string;
  image_landscape: string;
  image_square: string;

}
