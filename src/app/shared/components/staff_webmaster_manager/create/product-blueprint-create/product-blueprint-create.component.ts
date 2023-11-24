import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {StaffProductBlueprintService} from "../../../../../core/services/staff/staff-productblueprint-service";
import {StaffProductBlueprintI} from "../../../../models/staff/staff_productblueprint";
import {first} from "rxjs/operators";
import {NgIf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-product-blueprint-create',
  templateUrl: './product-blueprint-create.component.html',
  styleUrls: ['./product-blueprint-create.component.css'],
  imports: [
    NgIf,
    NgStyle
  ],
  standalone: true
})
export class ProductBlueprintCreateComponent {

  @Output() ToggleCreating = new EventEmitter<boolean>()

  constructor(private formBuilder: FormBuilder,
              private staffProductService: StaffProductBlueprintService) {
  }

  form = this.formBuilder.group({
    fieldname: ['', Validators.required],
  })
  form_error: string | null = null;
  loading: boolean = false

  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Wrong email or password");
      this.handleFormError(error);
      return;  }

    this.loading = true;

    const product = {}

    this.staffProductService.post(product).pipe(
        first()).subscribe({
      next: () => {
        // Succes
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    })
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
