import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {StaffProductBlueprintI} from '../../../../shared/models/staff/staff_productblueprint';
import {StaffProductBlueprintService} from '../../../../core/services/staff/staff-productblueprint-service';
import {ActivatedRoute} from '@angular/router';
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-product-webmaster-page',
  templateUrl: './product-webmaster-page.component.html',
  styleUrls: ['./product-webmaster-page.component.css']
})
export class ProductWebmasterPageComponent implements OnInit {

  productBlueprint$!: Observable<StaffProductBlueprintI>;

  productId!: string;

  constructor(private itemWideService: ItemWideService,
              private staffProductService: StaffProductBlueprintService,
              private route: ActivatedRoute,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    // If ID is null
    if (id === null) {
      // TODO Handle error
      return;
    }
    this.productId = id;

    this.productBlueprint$ = this.staffProductService.getProductBlueprint(this.productId);
  }

  public UpdateProduct(product_obj: StaffProductBlueprintI) {
    this.productBlueprint$ = this.staffProductService.putProductBlueprint(product_obj.id, product_obj);
  }
}
