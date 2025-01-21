import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {RecSysItemPreviewComponent} from '../../recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '../../../../models/item/recsysI';
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css'],
  standalone: true,
  imports: [
    NgIf,
    RecSysItemPreviewComponent,
    NgForOf,
    AsyncPipe
  ]
})
export class PromoListComponent implements OnInit {

  @Input() queryLimit: number = 5;
  @Input() promoType: string | null = null;

  recsysItems$: Observable<RecSysPreviewI[]> = of();

  constructor(private promoService: PromoService) {
  }

  ngOnInit() {
    this.recsysItems$ = this.promoService.getPromosList(this.queryLimit, 0);
  }
}
