import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {ToastrService} from "ngx-toastr";
import { NgIf, AsyncPipe } from '@angular/common';
import { ItemDetailComponent } from '../../../../shared/components/staff_webmaster_manager/details/staff-item-detail/item-detail.component';
import { ProductBlueprintDashboardComponent } from '../../../../shared/components/staff_webmaster_manager/dashboards/product-blueprint-dashboard/product-blueprint-dashboard.component';
import { CheckoutAndTransactionDashboardComponent } from '../../../../shared/components/staff_webmaster_manager/dashboards/checkout-and-transaction-dashboard/checkout-and-transaction-dashboard.component';
import { InteractionTableComponent } from '../../../../shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component';
import { DeleteButtonComponent } from '../../../../shared/components/staff_webmaster_manager/delete-button/delete-button.component';

@Component({
    selector: 'app-item-detail-dashboard',
    templateUrl: './item-dashboard-page.component.html',
    imports: [NgIf, ItemDetailComponent, ProductBlueprintDashboardComponent, CheckoutAndTransactionDashboardComponent, InteractionTableComponent, DeleteButtonComponent, AsyncPipe]
})
export class ItemDashboardPageComponent implements OnInit {

  $itemDetail: Observable<ItemWideI| null> = of(null);
  itemId!: number | string;

  constructor(private itemWideService: ItemWideService,
              private route: ActivatedRoute,
              private router: Router,
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

  public DeleteItem(itemId: number) {
    this.itemWideService.deleteItem(itemId).subscribe({
      next: value => {
        if (value === null) {
          this.toastrService.success('Item deleted!');
          this.router.navigate(['../']);
        } else {
          this.toastrService.error('Item could not be deleted?');
        }
      },
      error: error => {
        this.toastrService.error(`Item could not be deleted: ${error}`);
      }
    })
  }

  public isPaymentItem(derived_item_enum: string): boolean {
    return derived_item_enum === "eventitem" || derived_item_enum === "shoptitem";
  }

  public isInteractionOnlyItem(derived_item_enum: string): boolean {
    return derived_item_enum === "promoitem" || derived_item_enum === "carditem" || derived_item_enum === "notificationitem" || derived_item_enum === "linkitem";
  }
}
