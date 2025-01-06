import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable, of} from 'rxjs';
import {
  ProductBlueprintCreateComponent
} from '../../create/product-blueprint-create/product-blueprint-create.component';
import {MatTableModule} from '@angular/material/table';
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {PaymentStatusEnum} from "@ingenium/app/shared/models/payment/statusEnum";
import {AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-product-blueprint-dashboard',
  templateUrl: './product-blueprint-dashboard.component.html',
  styleUrls: ['./product-blueprint-dashboard.component.css'],
  imports: [
    AsyncPipe,
    NgIf,
    ProductBlueprintCreateComponent,
    MatTableModule,
  ],
  standalone: true
})
export class ProductBlueprintDashboardComponent implements OnInit {
  @Input() item!: ItemI;
  $productBlueprint: Observable<[]> = of([]);

  constructor(private productBlueprintService: ProductBlueprintService,
              private appFunctionsService: AppFunctionsService,) {
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

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
