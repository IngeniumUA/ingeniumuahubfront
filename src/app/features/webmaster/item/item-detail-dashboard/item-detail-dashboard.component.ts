import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {StaffItemDetailI} from "../../../../shared/models/staff/staff_item_details";
import {StaffItemService} from "../../../../core/services/staff/items/staff_item_router";
import {ActivatedRoute} from "@angular/router";
import {StaffProductBlueprintI} from "../../../../shared/models/staff/staff_productblueprint";
import {StaffProductBlueprintService} from "../../../../core/services/staff/staff-productblueprint-service";

@Component({
  selector: 'app-item-detail-dashboard',
  templateUrl: './item-detail-dashboard.component.html',
  styleUrls: ['./item-detail-dashboard.component.css']
})
export class ItemDetailDashboardComponent implements OnInit {

  $itemDetail: Observable<StaffItemDetailI| null> = of(null)
  $productBlueprint: Observable<StaffProductBlueprintI[]> = of([])

  addingTransaction: boolean = false

  itemId!: string

  constructor(private staffItemService: StaffItemService,
              private staffProductService: StaffProductBlueprintService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return
    }
    this.itemId = id


    this.$itemDetail = this.staffItemService.getItem(this.itemId)
  }

  UpdateItem(item: StaffItemDetailI) {
    this.$itemDetail = this.staffItemService.putItem(item.item.uuid, item)
  }

  disableItemBuffer: boolean = false
  loadingDisable: boolean = false
  public DisableItem() {
    if (this.disableItemBuffer) {
      this.loadingDisable = true
      this.$itemDetail = this.staffItemService.patchItem(this.itemId, {'disabled':'True'})
      this.loadingDisable = false
    } else {
      this.disableItemBuffer = true
    }
  }
}
