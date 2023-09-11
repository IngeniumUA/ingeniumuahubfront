import {IItem} from "./IItem";
export interface EventItemI {
  item: IItem;
  start_date: string;
  end_date: string;
  location: string;  // TODO Location Object, package maybe?
  image_landscape: string;
  image_square: string;
  description: string;

  button_text: string;
  main_color: string;
  text_color: string;
}
