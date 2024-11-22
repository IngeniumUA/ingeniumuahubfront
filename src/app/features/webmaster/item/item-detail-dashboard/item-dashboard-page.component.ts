import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-item-detail-dashboard',
  templateUrl: './item-dashboard-page.component.html',
  // styleUrls: ['./item-dashboard-page.component.css']
})
export class ItemDashboardPageComponent implements OnInit {

  $itemDetail: Observable<ItemWideI| null> = of(null);

  addingCheckout: boolean = false;

  itemId!: number | string;

  constructor(private itemWideService: ItemWideService,
              private route: ActivatedRoute,
              private toastrService: ToastrService,) {
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

  public DeleteItem(itemId: number) {
    this.itemWideService.deleteItem(itemId).subscribe({
      next: value => {
        if (value) {
          this.toastrService.success('Item deleted!');
        } else {
          this.toastrService.error('Item could not be deleted?');
        }
      },
      error: error => {
        this.toastrService.error(`Item could not be deleted: ${error}`);
      }
    })
  }

  ToggleAddingCheckout() {
    this.addingCheckout = !this.addingCheckout;
  }

  refetchTable(_reload: boolean) {
    this.ToggleAddingCheckout();
  }
}
