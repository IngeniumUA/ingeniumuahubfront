import {Component, Input} from '@angular/core';
import {StaffItemDetailI} from "../../../../models/staff/staff_item_details";
import {DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {DisplayMixinDetailComponent} from "../display-mixin-detail/display-mixin-detail.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

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
    ReactiveFormsModule
  ],
  standalone: true
})
export class StaffItemDetailComponent {

  @Input() item!: StaffItemDetailI
  @Input() editing: boolean = false

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
    // Update de waarden op displayMixin ( Remember, dit is een pointer naar memory )
    // Stuur signaal dat we ze geupdate hebben
    this.loading = false;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
