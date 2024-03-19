import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordService} from '../../../../core/services/user/password/password.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-auth-resetpw',
  templateUrl: './resetpw.component.html',
  styleUrls: ['./resetpw.component.css']
})
export class ResetpwComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;
  form_error: string | null = null;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private passwordService: PasswordService,
  ) {
  }

  uuid!: string;
  pw_settoken!: string;

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  onSubmit() {
    // Prevents double clicking
    if (this.loading) {
      return;
    }

    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Ongeldig email!');
      this.handleFormError(error);
      return;
    }

    this.loading = true;
    this.passwordService.sendPasswordEmail(this.form.controls['email'].value).pipe(
      first()).subscribe({
      next: () => {
        // get return url from query parameters ( so, ?next='' in the url), else default to home pag
        this.router.navigateByUrl('/home');
      },
      error: (error: any) => {
        this.loading = false;
        this.handleFormError(error);
      }
    });
  }
}
