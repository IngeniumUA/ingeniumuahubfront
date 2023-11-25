import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StaffProductBlueprintI} from "../../../../models/staff/staff_productblueprint";
import {DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductMetaI} from "../../../../models/items/products/products";
import {PricePolicyComponent} from "../price-policy/price-policy.component";
import {PricePolicyComponentCreate} from "../../create/price-policy/price-policy-component-create.component";

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
        PricePolicyComponentCreate
    ],
  standalone: true
})
export class ProductBlueprintDetailComponent implements OnInit {
    @Input() productBlueprint!: StaffProductBlueprintI
    @Output() updateProduct = new EventEmitter<StaffProductBlueprintI>()

    constructor(private formBuilder: FormBuilder) {
    }

    blueprintForm: any
    productMetaForm: any
    form_error: string | null = null;

    ngOnInit() {
        this.blueprintForm = this.formBuilder.group({
            available: [this.productBlueprint.available, Validators.required],
            name: [this.productBlueprint.name, Validators.required],
            description: [this.productBlueprint.description],
            max_total: [this.productBlueprint.max_total, [Validators.required, Validators.min(1)]],
            max_individual: [this.productBlueprint.max_individual, [Validators.required, Validators.min(1)]],
            max_per_checkout: [this.productBlueprint.max_per_checkout, [Validators.required, Validators.min(1)]],
        })

        this.productMetaForm = this.formBuilder.group({
            categorie: [this.productBlueprint.product_meta.categorie],
            group: [this.productBlueprint.product_meta.group],
        })
    }

    get f() { return this.blueprintForm.controls; }

    onSubmit() {
        // Check if valid guardclause
        if (this.productMetaForm.invalid) {
            const error: Error = Error("Invalid form");
            this.handleFormError(error);
            return;  }

        const productMeta: ProductMetaI = {
            group: this.productMetaForm.controls['group'].value,
            categorie: this.productMetaForm.controls['categorie'].value,
            upon_completion: this.productBlueprint.product_meta.upon_completion,
            popupz_opties: this.productBlueprint.product_meta.popupz_opties
        }

        // Check if valid guardclause
        if (this.blueprintForm.invalid) {
            const error: Error = Error("Invalid form");
            this.handleFormError(error);
            return;  }

        const product: StaffProductBlueprintI = {
            id: this.productBlueprint.id,
            available: this.blueprintForm.controls['available'].value,
            disabled: this.productBlueprint.disabled,
            date_created: this.productBlueprint.date_created,
            origin_item_id: this.productBlueprint.origin_item_id,
            source_item_ids: this.productBlueprint.source_item_ids,
            product_blueprint_pools: this.productBlueprint.product_blueprint_pools,
            name: this.blueprintForm.controls['name'].value,
            description: this.blueprintForm.controls['description'].value,

            max_total: this.blueprintForm.controls['max_total'].value,
            max_individual: this.blueprintForm.controls['max_individual'].value,
            max_per_checkout: this.blueprintForm.controls['max_per_checkout'].value,

            price_policies: this.productBlueprint.price_policies,

            product_meta: productMeta,
        }
        this.updateProduct.emit(product)
    }

    handleFormError(err: Error) {
        this.form_error = err.message;
    }

    addingNew: boolean = false
    public ToggleAddNew() {
        this.addingNew = !this.addingNew
    }
}
