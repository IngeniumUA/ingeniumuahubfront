import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {PromoService} from '../../../../../core/services/items/promo/promo.service';
import {RecSysPreviewI} from '../../../../../shared/models/items/recsys_interfaces';
import {LayoutService} from '../../../../../core/services/layout/layout.service';

@Component({
  selector: 'app-vacatures-list-display',
  templateUrl: './vacatures-list-display.component.html',
  styleUrls: ['./vacatures-list-display.component.scss']
})
export class VacaturesListDisplayComponent {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacatures$: Observable<RecSysPreviewI[]> = this.promoService.getPromosList(50, 0, 'vacature');

  constructor(private promoService: PromoService,
              private layoutService: LayoutService) {
  }
}
