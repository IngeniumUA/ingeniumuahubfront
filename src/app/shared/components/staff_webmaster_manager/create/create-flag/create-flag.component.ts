import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {NgStyle} from "@angular/common";
import {FlagService} from "@ingenium/app/core/services/coreAPI/flag/flag.service";
import {FlagInI} from "@ingenium/app/shared/models/flag/hubFlagI";

@Component({
  selector: 'app-create-flag',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './create-flag.component.html',
  styleUrl: './create-flag.component.css'
})
export class CreateFlagComponent {

  constructor(private formBuilder: FormBuilder,
              private flagService: FlagService) {
  }

  @Output() public flagCreated = new EventEmitter<boolean>();

  form = this.formBuilder.group({
    name: ["", [Validators.required]]
  });
  form_error: string | null = null;

  loading: boolean = false

  onSubmit() {
    this.loading = true;

    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Invalid form');
      this.handleFormError(error);
      this.loading = false;
      return;
    }

    // Own check for name value
    const nameControlValue = this.form.controls['name'].value;
    if (nameControlValue === null) {
      this.handleFormError(new Error(`Name field is required`));
      this.loading = false
      return;
    }

    // Parsing form
    const flagObj: FlagInI = {
      name: nameControlValue
    }

    // Submitting
    this.flagService.postFlag(flagObj).pipe(
      first()).subscribe({
      next: () => {
        this.form_error = null
        this.flagCreated.emit(true);
        this.loading = false;
      },
      error: error => {
        this.handleFormError(error);
        this.loading = false;
      }
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }
}
