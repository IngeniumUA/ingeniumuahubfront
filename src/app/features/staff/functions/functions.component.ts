import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AssignLidPayload, StaffFunctionsService} from '../../../core/services/staff/staff-functions.service';
import {Observable, of} from 'rxjs';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['./functions.component.css']
})
export class FunctionsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private staffFuncService: StaffFunctionsService) {
  }

  succes: boolean = false;
  loading: boolean = false;

  ngOnInit() {

  }

  form_error: string | null = null;
  registerForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    lid_type: ['']
  });
  register_action_cache: Observable<AssignLidPayload | null> = of(null);

  get f_reg() { return this.registerForm.controls; }

  public registerNewLid() {
    // Check if valid guardclause
    if (this.registerForm.invalid) {
      const error: Error = Error('Somehow, invalid');
      this.handleFormError(error);
      return;  }

    this.loading = true;
    this.staffFuncService.register_new_account(this.f_reg['email'].value!, this.f_reg['lid_type'].value!, 'null').pipe(
      first()).subscribe({
      next: () => {
        this.loading = false;
        this.succes = true;
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    });
  }

  public undoRegisterNewLid() {}


  handleFormError(err: Error) {
    this.form_error = err.message;
  }
}
