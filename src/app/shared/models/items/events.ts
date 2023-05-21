import {Item} from "./item";

export class EventPreviewModel {
  item!: Item;
  start_date!: string;
  end_date!: string;
  location!: string;  // TODO Location Object, package maybe?
  image_landscape!: string;
  image_square!: string;
  button_text!: string;
  main_color!: "000000000";
  text_color!: "#000000"
}

export interface EventModelInterface {

  item: Item;
  start_date: string;
  end_date: string;
  location: string;  // TODO Location Object, package maybe?
  image_landscape: string;
  image_square: string;
  description: string;
  main_color: string;
  text_color: string;
}
