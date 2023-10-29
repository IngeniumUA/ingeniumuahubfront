import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {StaffItemDetailI} from "../../../../shared/models/staff/staff_item_details";
import {StaffItemService} from "../../../../core/services/staff/items/staff_item_router";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-item-detail-dashboard',
  templateUrl: './item-detail-dashboard.component.html',
  styleUrls: ['./item-detail-dashboard.component.css']
})
export class ItemDetailDashboardComponent implements OnInit {

  $itemDetail: Observable<StaffItemDetailI| null> = of(null)

  constructor(private staffItemService: StaffItemService,
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

    this.$itemDetail = this.staffItemService.getItem(id)
  }

}
