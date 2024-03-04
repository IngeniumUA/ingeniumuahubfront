import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RecSysItemPreviewComponent} from "../../recsys/rec-sys-item-preview/rec-sys-item-preview.component";
import {Observable, of} from "rxjs";
import {RecSysPreviewI} from "../../../../models/items/recsys_interfaces";
import {PromoService} from "../../../../../core/services/items/promo/promo.service";

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.css'],
  imports: [
    NgIf,
    RecSysItemPreviewComponent,
    NgForOf,
    AsyncPipe
  ],
  standalone: true
})
export class PromoListComponent implements OnInit {

  @Input() promoType: string | null = null;

  recsysItems$: Observable<RecSysPreviewI[]> = of()

  constructor(private promoService: PromoService) {
  }

  ngOnInit() {
    this.recsysItems$ = this.promoService.getPromosList(5, 0, this.promoType);
  }
}
