import { Pipe, PipeTransform } from '@angular/core';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {CardItemWideI} from "@ingenium/app/shared/models/item/cardI";

@Pipe({
  name: 'asItemWide',
  standalone: true,
})
export class AsItemWide implements PipeTransform {
  transform(inputWide: any): ItemWideI {
    return inputWide
  }
}

@Pipe({
  name: 'asCardItemWide',
  standalone: true,
})
export class AsCardItemWide implements PipeTransform {
  transform(inputWide: any): CardItemWideI {
    return inputWide
  }
}
