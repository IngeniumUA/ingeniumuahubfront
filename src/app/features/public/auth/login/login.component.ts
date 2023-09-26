import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {AuthService} from "../../../../core/services/user/auth/auth.service";
import {SocialAuthService} from "@abacritt/angularx-social-login";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  form_error: string | null = null;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private socialAuthService: SocialAuthService,
              ) { }
  ngOnInit() {
    if (this.authService.userValue) {
      this.router.navigate(['home'])
    }

    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    })

    this.socialAuthService.authState.subscribe((user) => {
      this.authService.google_login(user.idToken).pipe(
        first()).subscribe({
        next: () => {
          // get return url from query parameters ( so, ?next='' in the url), else default to home page
          const returnUrl = this.route.snapshot.queryParams['next'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          this.loading = false;
          this.handleFormError(error);
        }
      })
    }
    )
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Ongeldige email or password");
      this.handleFormError(error);
      return;
    }

    this.loading = true;
    this.authService.login(this.form.controls['email'].value, this.form.controls['password'].value).pipe(
      first()).subscribe({
        next: () => {
          // get return url from query parameters ( so, ?next='' in the url), else default to home page
          const returnUrl = this.route.snapshot.queryParams['next'] || '/';
          this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          this.loading = false;
          this.handleFormError(error);
        }
    })
  }

  loginUAntwerp() {
    const error: Error = Error("Da zou mooi zijn ofni");
    this.handleFormError(error);
    return;
  }

  handleFormError(err: Error) {
    if (!(err instanceof HttpErrorResponse)) {
      this.form_error = err.message;
      return;
    } else {
      if (err.status == 401) {
        this.form_error = "Ongeldige email en password combinatie";
        return
      }
    }
    this.form_error = "Er ging iets fout!";
  }
}
