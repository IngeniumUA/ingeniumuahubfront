import {Item} from "./item";

export class EventPreview {
  item!: Item;

  start_date!: string;
  end_date!: string;
  location!: string;  // TODO Location Object, package maybe?
  background_image!: string;
  button_text!: string;
  main_color!: "#FFFFFF"
  text_color!: "#000000"
}
