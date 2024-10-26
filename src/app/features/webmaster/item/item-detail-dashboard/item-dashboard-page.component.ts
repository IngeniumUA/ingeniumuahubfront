import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";

@Component({
  selector: 'app-item-detail-dashboard',
  templateUrl: './item-dashboard-page.component.html',
  // styleUrls: ['./item-dashboard-page.component.css']
})
export class ItemDashboardPage implements OnInit {

  $itemDetail: Observable<ItemWideI| null> = of(null);

  addingCheckout: boolean = false;

  itemId!: number | string;

  constructor(private itemWideService: ItemWideService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return;
    }
    this.itemId = id;


    this.$itemDetail = this.itemWideService.getItem(this.itemId);
  }

  UpdateItem(item: ItemWideI) {
    this.$itemDetail = this.itemWideService.putItem(item.item.id, item);
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

  ToggleAddingCheckout() {
    this.addingCheckout = !this.addingCheckout;
  }

  refetchTable(_reload: boolean) {
    this.ToggleAddingCheckout();
  }
}
