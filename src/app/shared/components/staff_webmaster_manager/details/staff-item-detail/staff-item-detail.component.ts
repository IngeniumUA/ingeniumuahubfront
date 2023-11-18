import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StaffItemDetailI} from "../../../../models/staff/staff_item_details";
import {DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {DisplayMixinDetailComponent} from "../display-mixin-detail/display-mixin-detail.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

interface FormField {
  name: string
  selector: string
}

@Component({
  selector: 'app-staff-item-detail',
  templateUrl: './staff-item-detail.component.html',
  styleUrls: ['./staff-item-detail.component.css'],
  imports: [
    NgIf,
    DisplayMixinDetailComponent,
    NgStyle,
    DatePipe,
    NgForOf,
    ReactiveFormsModule,
    MatInputModule
  ],
  standalone: true
})
export class StaffItemDetailComponent {

  @Input() item!: StaffItemDetailI
  @Input() editing: boolean = false
  @Output() itemUpdate = new EventEmitter<StaffItemDetailI>;

  form_error: string | null = null;
  loading: boolean = false
  itemForm: any

  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    this.itemForm = this.formBuilder.group({
      name: [this.item.item.name, Validators.required],
      description: [this.item.item.description, Validators.required],
      available: [true, Validators.required],
      disabled: [this.item.item.disabled, Validators.required],
    })
  }

  onSubmit(): void {
    // Check if valid guardclause
    if (this.itemForm.invalid) {
      const error: Error = Error("Wrong email or password");
      this.handleFormError(error);
      return;  }

    this.loading = true;
    // The underlying components always send updated information in their fields up to the parent
    // When we send the formdata to the parent here, alle data is as seen on the page

    // This manually assignign all fields is not great code
    // So, to be changed later
    this.item.item.available = this.itemForm.controls['available'].value
    this.item.item.disabled = this.itemForm.controls['disabled'].value
    this.item.item.name = this.itemForm.controls['name'].value
    this.item.item.description = this.itemForm.controls['description'].value
    this.itemUpdate.emit(this.item)

    this.loading = false;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
