import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ProductBlueprintI} from "@ingenium/app/shared/models/product_blueprint/productBlueprintModels";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {backButtonClicked} from "@app_services/app-functions.service";

@Component({
  selector: 'app-product-webmaster-page',
  templateUrl: './product-webmaster-page.component.html',
  styleUrls: ['./product-webmaster-page.component.css']
})
export class ProductWebmasterPageComponent implements OnInit {

  productBlueprint$!: Observable<ProductBlueprintI>;

  productId!: number;

  constructor(private productBlueprintService: ProductBlueprintService,
              private route: ActivatedRoute,) {
    backButtonClicked()
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return;
    }
    this.productId = parseInt(id);

    this.productBlueprint$ = this.productBlueprintService.getProductBlueprint(this.productId);
  }

  public UpdateProduct(product_obj: ProductBlueprintI) {
    this.productBlueprint$ = this.productBlueprintService.putProductBlueprint(product_obj.id, product_obj);
  }
}
