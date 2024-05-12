import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordService} from '../../../../core/services/user/password/password.service';
import {first} from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-page',
  templateUrl: './resetpw.component.html',
})
export class ResetpwComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private passwordService: PasswordService,
              private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required, Validators.email]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.loading || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.passwordService.sendPasswordEmail(this.form.controls['email'].value).pipe(
      first()).subscribe({
      next: () => {
        this.toastService.success('We hebben een e-mail gestuurd met instructies om je wachtwoord te resetten.', 'E-mail verstuurd');
      },
      error: (error: any) => {
        this.loading = false;
        this.toastService.error(error.error.message, 'Er is iets misgegaan');
      }
    });
  }
}
