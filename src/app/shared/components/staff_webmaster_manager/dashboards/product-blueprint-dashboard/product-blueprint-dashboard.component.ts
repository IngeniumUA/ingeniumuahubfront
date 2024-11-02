import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {Observable, of} from 'rxjs';
import {
  ProductBlueprintDetailComponent
} from '../../details/product-blueprint-detail/product-blueprint-detail.component';
import {
  ProductBlueprintCreateComponent
} from '../../create/product-blueprint-create/product-blueprint-create.component';
import {MatTableModule} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";

@Component({
  selector: 'app-product-blueprint-dashboard',
  templateUrl: './product-blueprint-dashboard.component.html',
  styleUrls: ['./product-blueprint-dashboard.component.css'],
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    ProductBlueprintDetailComponent,
    ProductBlueprintCreateComponent,
    DatePipe,
    MatTableModule,
    RouterLink,
    JsonPipe
  ],
  standalone: true
})
export class ProductBlueprintDashboardComponent implements OnInit {
  @Input() item!: ItemI;
  $productBlueprint: Observable<[]> = of([]);

  constructor(private productBlueprintService: ProductBlueprintService) {
  }

  calcTotal(input: []): number {
    return input.reduce((acc, blueprintStat: any) => acc + blueprintStat.transaction_count, 0);
  }

  loadData() {
    this.$productBlueprint = this.productBlueprintService.queryProductTable(this.item.id,
      this.item.id,
      PaymentStatusEnum.successful);  // source_item
  }

  ngOnInit() {
    this.loadData()
  }

  addingNew: boolean = false;
  ToggleAddNew() {
    this.addingNew = ! this.addingNew;
  }

  NewProduct() {
    this.addingNew = false;
    this.$productBlueprint = this.productBlueprintService.queryProductTable(this.item.id,
      this.item.id,
      PaymentStatusEnum.successful);  // source_item
  }

}
