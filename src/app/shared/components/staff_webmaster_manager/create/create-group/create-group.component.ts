import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {GroupService} from "@ingenium/app/core/services/coreAPI/group/group.service";
import {GroupInI} from "@ingenium/app/shared/models/group/HubGroup";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent {
  @Output() public groupCreated = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService) {}

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
    const groupObj: GroupInI = {
      name: nameControlValue,
      academic_year: null
    }

    // Submitting
    this.groupService.postGroup(groupObj).pipe(
      first()).subscribe({
      next: () => {
        this.form_error = null
        this.groupCreated.emit(true);
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
