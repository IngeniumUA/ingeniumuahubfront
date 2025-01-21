import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CheckoutTrackerConfigI, ProductMetaI, UponCompletionMetaI} from '../../../../models/product/products';
import {PricePolicyComponent} from '../price-policy/price-policy.component';
import {PricePolicyComponentCreateComponent} from '../../create/price-policy/price-policy-component-create.component';
import {PricePolicyI, PricePolicyInI} from '../../../../models/price_policy';
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {Observable, of} from "rxjs";
import {PricePolicyService} from "@ingenium/app/core/services/coreAPI/blueprint/pricePolicy.service";
import {first} from "rxjs/operators";
import {ProductBlueprintI} from "@ingenium/app/shared/models/product_blueprint/productBlueprintModels";
import {
  DeleteButtonComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/delete-button/delete-button.component";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-product-blueprint-detail',
    templateUrl: './product-blueprint-detail.component.html',
    styleUrls: ['./product-blueprint-detail.component.css'],
    imports: [
        DatePipe,
        RouterLink,
        JsonPipe,
        NgForOf,
        FormsModule,
        ReactiveFormsModule,
        NgIf,
        PricePolicyComponent,
        PricePolicyComponentCreateComponent,
        AsyncPipe,
        DeleteButtonComponent
    ]
})
export class ProductBlueprintDetailComponent implements OnInit {
    @Input() productBlueprint!: ProductBlueprintI;
    @Output() updateProduct = new EventEmitter<ProductBlueprintI>();

    $pricePolicies: Observable<PricePolicyI[]> = of([]);

    constructor(private formBuilder: FormBuilder,
                private pricePolicyService: PricePolicyService,
                private blueprintService: ProductBlueprintService,
                private toastrService: ToastrService) {
    }

    blueprintForm: any;
    productMetaForm: any;
    form_error: string | null = null;

    ngOnInit() {
      this.getPricePolicies()

      this.blueprintForm = this.formBuilder.group({
        available: [this.productBlueprint.availability.available, Validators.required],
        name: [this.productBlueprint.name, Validators.required],
        description: [this.productBlueprint.description],
        max_total: [this.productBlueprint.max_total, [Validators.required, Validators.min(1)]],
        max_individual: [this.productBlueprint.max_individual, [Validators.required, Validators.min(1)]],
        max_per_checkout: [this.productBlueprint.max_per_checkout, [Validators.required, Validators.min(1)]],
        product_ordering: [this.productBlueprint.ordering, [Validators.required]],
      });

      // Temporary "bool" for toggling checkout_tracking
      const tracking_checkout = !(this.productBlueprint.product_blueprint_metadata?.upon_completion?.track_checkout == null)

      this.productMetaForm = this.formBuilder.group({
        categorie: [this.productBlueprint.product_blueprint_metadata.categorie],
        group: [this.productBlueprint.product_blueprint_metadata.group],
        upon_completion: [''],
        track_checkout: [tracking_checkout]
        // todo upon_completion: [this.productBlueprint.product_blueprint_metadata.upon_completion === null ? '': JSON.stringify(this.productBlueprint.product_blueprint_metadata.upon_completion[0])]
      });
    }

    onSubmit() {
      // Check if valid guardclause
      if (this.productMetaForm.invalid) {
        const error: Error = Error('Invalid Metadata form');
        this.handleFormError(error);
        return;  }


      const track_checkout: boolean = this.productMetaForm.controls['track_checkout'].value;
      const checkout_config: CheckoutTrackerConfigI = {
        status_queue: [1, 2, 3],
        disabled_on_status: 3
      }
      const upon_completion_filled: UponCompletionMetaI = {
        track_checkout: checkout_config
      }
      const upon_completion = track_checkout ? upon_completion_filled: null;


      const productMeta: ProductMetaI = {
        group: this.productMetaForm.controls['group'].value,
        categorie: this.productMetaForm.controls['categorie'].value,
        upon_completion: upon_completion,
        other_meta_data: this.productBlueprint.product_blueprint_metadata.other_meta_data
      };

      // Check if valid guardclause
      if (this.blueprintForm.invalid) {
        const error: Error = Error('Invalid Blueprint form');
        this.handleFormError(error);
        return;  }

      const availability: AvailabilityCompositionI = {
        available: this.blueprintForm.controls['available'].value,
        disabled: this.productBlueprint.availability.disabled,
        available_from: null,
        available_until: null,
        dynamic_policy_type: null,
        dynamic_policy_content: null
      }

      const product: ProductBlueprintI = {
        id: this.productBlueprint.id,
        availability: availability,
        created_timestamp: this.productBlueprint.created_timestamp,
        last_update_timestamp: this.productBlueprint.last_update_timestamp,
        origin_item_id: this.productBlueprint.origin_item_id,
        source_item_ids: this.productBlueprint.source_item_ids,
        product_blueprint_pool_ids: this.productBlueprint.product_blueprint_pool_ids,
        name: this.blueprintForm.controls['name'].value,
        description: this.blueprintForm.controls['description'].value,

        max_total: this.blueprintForm.controls['max_total'].value,
        max_individual: this.blueprintForm.controls['max_individual'].value,
        max_per_checkout: this.blueprintForm.controls['max_per_checkout'].value,

        ordering: this.blueprintForm.controls['product_ordering'].value,

        price_policies: [],

        product_blueprint_metadata: productMeta
      };
      this.updateProduct.emit(product);
    }

    handleFormError(err: Error) {
      this.form_error = err.message;
    }


    /*
      *  Price policy code
     */
    public getPricePolicies() {
      this.$pricePolicies = this.pricePolicyService.getPricePolicies(this.productBlueprint.id);
    }

    public UpdatePricePolicy(pricePolicyObj: PricePolicyI) {
      this.pricePolicyService.putPricePolicy(pricePolicyObj).pipe(
      first()).subscribe({
        next: () => {
          this.getPricePolicies()
        },
        error: error => {
          this.handleFormError(error);
        }
      });
    }

    addingNewPricePolicy: boolean = false;
    public ToggleAddNew() {
      this.addingNewPricePolicy = !this.addingNewPricePolicy;
    }

    public AddPricePolicy(pricePolicyObj: PricePolicyInI | null) {
      if (pricePolicyObj === null) {
        this.ToggleAddNew()
        return
      }

      // Post for price policy object
      this.pricePolicyService.createPricePolicy(pricePolicyObj).pipe(
        first()).subscribe({
        next: () => {
          this.getPricePolicies();
          this.ToggleAddNew();
          this.form_error = null
        },
        error: error => {
          this.handleFormError(error);
        }
      });
    }

    public RemovePricePolicy(pricePolicy: PricePolicyI) {
      // Post for price policy object
      this.pricePolicyService.deletePricePolicy(pricePolicy.id).pipe(
        first()).subscribe({
        next: () => {
          this.getPricePolicies();
          this.form_error = null
        },
        error: error => {
          this.handleFormError(error);
        }
      });
    }

  deleteBlueprint(blueprintId: number) {
    this.blueprintService.deleteProductBlueprint(blueprintId).subscribe({
      next: value => {
        if (value) {
          this.toastrService.success('Item deleted!');
        } else {
          this.toastrService.error('Item could not be deleted?');
        }
      },
      error: error => {
        this.toastrService.error(`Item could not be deleted: ${error}`);
      }
    })
  }
}
