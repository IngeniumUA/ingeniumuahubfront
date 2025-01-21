import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {
  ItemDetailComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/details/staff-item-detail/item-detail.component";
import {Observable, of} from "rxjs";
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {CardItemWideI} from "@ingenium/app/shared/models/item/cardI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {CardService} from "@ingenium/app/core/services/coreAPI/item/derived_services/card.service";
import {ActivatedRoute} from "@angular/router";
import {AsItemWide} from "@ingenium/app/shared/pipes/item/itemWidePipes";
import {
  InteractionTableComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component";

@Component({
    selector: 'app-card-item-dashboard',
    imports: [
        AsyncPipe,
        NgIf,
        ItemDetailComponent,
        AsItemWide,
        AsItemWide,
        InteractionTableComponent
    ],
    templateUrl: './card-page.component.html'
})
export class CardPageComponent implements OnInit {

  itemId!: number | string;
  $itemDetail: Observable<CardItemWideI | null> = of(null);

  constructor(private itemWideService: ItemWideService,
              private cardService: CardService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      return;
    }
    this.itemId = parseInt(id);


    this.$itemDetail = this.cardService.getCard(this.itemId);
  }

  UpdateItem(item: ItemWideI): void {
    const cardItemWide = item as CardItemWideI;
    this.$itemDetail = this.cardService.putCard(item.item.id, cardItemWide);
  }

  disableItemBuffer: boolean = false;
  loadingDisable: boolean = false;

  public DisableItem(itemId: number) {
    if (this.disableItemBuffer) {
      this.loadingDisable = true;
      this.itemWideService.deleteItem(itemId);
      this.loadingDisable = false;
    } else {
      this.disableItemBuffer = true;
    }
  }
}
