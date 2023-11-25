import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {StaffProductBlueprintI} from "../../../../shared/models/staff/staff_productblueprint";
import {StaffItemService} from "../../../../core/services/staff/items/staff_item_router";
import {StaffProductBlueprintService} from "../../../../core/services/staff/staff-productblueprint-service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-webmaster-page',
  templateUrl: './product-webmaster-page.component.html',
  styleUrls: ['./product-webmaster-page.component.css']
})
export class ProductWebmasterPageComponent implements OnInit {

  productBlueprint$!: Observable<StaffProductBlueprintI>

  productId!: string

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
    this.productId = id

    this.productBlueprint$ = this.staffProductService.getProductBlueprint(this.productId)
  }
}
