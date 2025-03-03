import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable, of} from 'rxjs';
import {
  ProductBlueprintCreateComponent
} from '../../create/product-blueprint-create/product-blueprint-create.component';
import {MatTableModule} from '@angular/material/table';
import {RouterLink} from '@angular/router';
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {CurrencyPipe} from "@ingenium/app/shared/pipes/currency.pipe";
import {PricePolicyService} from "@ingenium/app/core/services/coreAPI/blueprint/pricePolicy.service";

@Component({
  selector: 'app-product-blueprint-dashboard',
  templateUrl: './product-blueprint-dashboard.component.html',
  styleUrls: ['./product-blueprint-dashboard.component.css'],
  imports: [
    AsyncPipe,
    NgIf,
    ProductBlueprintCreateComponent,
    MatTableModule,
    RouterLink,
    CurrencyPipe
  ],
  standalone: true
})
export class ProductBlueprintDashboardComponent implements OnInit {
  @Input() item!: ItemI;
  $productBlueprint: Observable<[]> = of([]);
  $pricePolicyTable: Observable<[]> = of([]);

  constructor(private productBlueprintService: ProductBlueprintService,
              private pricePolicyService: PricePolicyService,) {
  }

  calcTotal(input: []): number {
    return input.reduce((acc, stat: any) => acc + stat.transaction_count, 0);
  }

  loadData() {
    this.$productBlueprint = this.productBlueprintService.queryProductTable(this.item.id,
      this.item.id,
      PaymentStatusEnum.successful);  // source_item
    this.$pricePolicyTable = this.pricePolicyService.queryPricePolicyTable(this.item.id, this.item.id,)
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
