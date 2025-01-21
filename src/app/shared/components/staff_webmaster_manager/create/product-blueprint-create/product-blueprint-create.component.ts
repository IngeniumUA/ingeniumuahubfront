import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {DatePipe, NgIf, NgStyle} from '@angular/common';
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {ProductBlueprintInI} from "@ingenium/app/shared/models/product_blueprint/productBlueprintModels";

@Component({
    selector: 'app-product-blueprint-create',
    templateUrl: './product-blueprint-create.component.html',
    styleUrls: ['./product-blueprint-create.component.css'],
    imports: [
        NgIf,
        NgStyle,
        ReactiveFormsModule,
        DatePipe
    ]
})
export class ProductBlueprintCreateComponent {
  @Output() ToggleCreating = new EventEmitter<boolean>();
  @Output() FinishedCreating = new EventEmitter<boolean>();
  @Input() originItem!: ItemI;

  productBlueprintForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    max_total: [0, [Validators.required, Validators.min(1)]],
    max_individual: [0, [Validators.required, Validators.min(1)]],
    max_per_checkout: [0, [Validators.required, Validators.min(1)]],
    ordering: [0, [Validators.required]],
  });
  form_error: string | null = null;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private productBlueprintService: ProductBlueprintService) { }

  get f() { return this.productBlueprintForm.controls; }

  onSubmit() {
    // Check if valid guard clause
    if (this.productBlueprintForm.invalid) {
      const error: Error = Error('Clientside invalid form');
      this.handleFormError(error);
      return;  }

    this.loading = true;

    const product: ProductBlueprintInI = {
      origin_item_id: this.originItem.id,
      name: this.productBlueprintForm.controls['name'].value!,
      description: this.productBlueprintForm.controls['description'].value!,

      max_total: this.productBlueprintForm.controls['max_total'].value,
      max_individual: this.productBlueprintForm.controls['max_individual'].value,
      max_per_checkout: this.productBlueprintForm.controls['max_per_checkout'].value,

      ordering: this.productBlueprintForm.controls['ordering'].value,

      availability: {
        available: false,
        disabled: false,
        dynamic_policy_type: null,
        dynamic_policy_content: null
      },
    };

    this.productBlueprintService.postProductBlueprint(product).pipe(
      first()).subscribe({
      next: () => {
        this.FinishedCreating.emit(true);
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
