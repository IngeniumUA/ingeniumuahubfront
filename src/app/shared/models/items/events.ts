import {Item} from "./item";

export class EventPreview {
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
