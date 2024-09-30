import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {StaffProductBlueprintService} from '@ingenium/app/core/services/staff/staff-productblueprint-service';
import {first} from 'rxjs/operators';
import {DatePipe, NgIf, NgStyle} from '@angular/common';
import {ItemI} from "@ingenium/app/shared/models/item/itemI";

@Component({
  selector: 'app-product-blueprint-create',
  templateUrl: './product-blueprint-create.component.html',
  styleUrls: ['./product-blueprint-create.component.css'],
  imports: [
    NgIf,
    NgStyle,
    ReactiveFormsModule,
    DatePipe
  ],
  standalone: true
})
export class ProductBlueprintCreateComponent {
  @Output() ToggleCreating = new EventEmitter<boolean>();
  @Output() FinishedCreating = new EventEmitter<boolean>();
  @Input() originItem!: ItemI;

  productBlueprintForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    max_total: [0, [Validators.required, Validators.min(1)]],
    max_individual: [0, [Validators.required, Validators.min(1)]],
    max_per_checkout: [0, [Validators.required, Validators.min(1)]],
    ordering: [0, [Validators.required]],
  });
  form_error: string | null = null;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, private staffProductService: StaffProductBlueprintService) { }

  get f() { return this.productBlueprintForm.controls; }

  onSubmit() {
    // Check if valid guard clause
    if (this.productBlueprintForm.invalid) {
      const error: Error = Error('Clientside invalid form');
      this.handleFormError(error);
      return;  }

    this.loading = true;

    const product = {
      origin_item_id: this.originItem.id,
      name: this.productBlueprintForm.controls['name'].value,
      description: this.productBlueprintForm.controls['description'].value,

      max_total: this.productBlueprintForm.controls['max_total'].value,
      max_individual: this.productBlueprintForm.controls['max_individual'].value,
      max_per_checkout: this.productBlueprintForm.controls['max_per_checkout'].value,

      ordering: this.productBlueprintForm.controls['ordering'].value,

      product_meta: null,

      disabled: false,
      available: true,
    };

    this.staffProductService.post(product).pipe(
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
