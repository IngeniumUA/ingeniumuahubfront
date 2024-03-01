import {Component, OnInit} from '@angular/core';
import {PromoI} from "../../../../../shared/models/items/promo";
import {Observable, of} from "rxjs";
import {PromoService} from "../../../../../core/services/items/promo/promo.service";
import {RecSysPreviewI} from "../../../../../shared/models/items/recsys_interfaces";
import {LayoutService} from "../../../../../core/services/layout/layout.service";

@Component({
  selector: 'app-vacatures-list-display',
  templateUrl: './vacatures-list-display.component.html',
  styleUrls: ['./vacatures-list-display.component.css']
})
export class VacaturesListDisplayComponent {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacatures$: Observable<RecSysPreviewI[]> = this.promoService.getPromosList('vacature')

  constructor(private promoService: PromoService,
              private layoutService: LayoutService) {
  }
}
