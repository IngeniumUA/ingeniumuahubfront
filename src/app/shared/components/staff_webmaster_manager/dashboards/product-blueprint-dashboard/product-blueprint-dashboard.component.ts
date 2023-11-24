import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable, of} from "rxjs";
import {StaffProductBlueprintI} from "../../../../models/staff/staff_productblueprint";
import {StaffProductBlueprintService} from "../../../../../core/services/staff/staff-productblueprint-service";
import {
  ProductBlueprintDetailComponent
} from "../../details/product-blueprint-detail/product-blueprint-detail.component";
import {
  ProductBlueprintCreateComponent
} from "../../create/product-blueprint-create/product-blueprint-create.component";

@Component({
  selector: 'app-product-blueprint-dashboard',
  templateUrl: './product-blueprint-dashboard.component.html',
  styleUrls: ['./product-blueprint-dashboard.component.css'],
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    ProductBlueprintDetailComponent,
    ProductBlueprintCreateComponent
  ],
  standalone: true
})
export class ProductBlueprintDashboardComponent implements OnInit {

  @Input() itemId!: string
  $productBlueprint: Observable<StaffProductBlueprintI[]> = of([])

  constructor(private staffProductService: StaffProductBlueprintService) {
  }

  ngOnInit() {

    this.$productBlueprint = this.staffProductService.getProductBlueprint(0, 50, this.itemId)  // source_item
  }


  addingNew: boolean = false
  ToggleAddNew() {
    this.addingNew = ! this.addingNew
  }

}
