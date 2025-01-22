import { Pipe, PipeTransform } from '@angular/core';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {CardItemWideI} from "@ingenium/app/shared/models/item/cardI";
import {ShopItemWideI} from "@ingenium/app/shared/models/item/shopI";
import {LinkItemWideI} from "@ingenium/app/shared/models/item/linkI";
import {PromoItemWideI} from "@ingenium/app/shared/models/item/promoI";
import {EventItemWideI} from "@ingenium/app/shared/models/item/eventI";
import {NotificationItemWideI} from "@ingenium/app/shared/models/item/hubNotificationItemI";

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
  name: 'asEventItemWide',
  standalone: true,
})
export class AsEventItemWide implements PipeTransform {
  transform(inputWide: any): EventItemWideI {
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

@Pipe({
  name: 'asShopItemWide',
  standalone: true,
})
export class AsShopItemWide implements PipeTransform {
  transform(inputWide: any): ShopItemWideI {
    return inputWide
  }
}

@Pipe({
  name: 'asPromoItemWide',
  standalone: true,
})
export class AsPromoItemWide implements PipeTransform {
  transform(inputWide: any): PromoItemWideI {
    return inputWide
  }
}

@Pipe({
  name: 'asLinkItemWide',
  standalone: true,
})
export class AsLinkItemWide implements PipeTransform {
  transform(inputWide: any): LinkItemWideI {
    return inputWide
  }
}

@Pipe({
  name: 'asNotificationItemWide',
  standalone: true,
})
export class AsNotificationItemWide implements PipeTransform {
  transform(inputWide: any): NotificationItemWideI {
    return inputWide
  }
}
