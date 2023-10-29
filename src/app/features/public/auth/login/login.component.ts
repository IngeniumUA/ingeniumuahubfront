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
  loginHint: string | null = null
  ngOnInit() {
    if (this.authService.userValue) {
      this.router.navigate(['home'])
    }

    // Setting up form
    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    })

    // Setting up Google auth
    this.SetupGoogleAuth()

    // Typehint
    this.SetupLoginHint()
  }

  SetupLoginHint() {
    const returnUrl: string = this.route.snapshot.queryParams['next'] || null;
    if (returnUrl === null) {
      return
    }
    if (returnUrl.includes('cloud')) {
      this.loginHint = "De cloud is gratis!\nJe moet enkel even inloggen om er gebruik van te maken."
    }
  }

  /* EMAIL + PW AUTH */
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Ongeldige email or password");
      this.handleFormError(error);
      return;
    }
    if (this.loading) {
      return
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

  handleFormError(err: Error) {
    if (!(err instanceof HttpErrorResponse)) {
      // If it is no HTTP error then the error has to be a form error
      this.form_error = err.message;
      return;
    } else {
      // HTTP error could be a couple of things

      // 401_INVALID_CREDENTIALS is thrown in most of the cases
      if (err.status == 401) {
        this.form_error = "Ongeldige email en password combinatie";
        return;
      }

      // 404_NOT_FOUND is thrown bij niet gevonden email
      if (err.status == 404) {
        this.form_error = "Ongeldige email en password combinatie";
        return;
      }

      // 500_INTERNAL_SERVER_ERROR should never happen.
      if (err.status == 500) {
        this.form_error = "Interne fout! Probeer het later opnieuw.";
        return;
      }

    }
    this.form_error = "Er ging iets fout!";
  }

  /* Google Authentication */
  SetupGoogleAuth() {
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

  /* UAntwerpen Authentication */
  loginUAntwerp() {
    const error: Error = Error("Da zou mooi zijn ofni");
    this.handleFormError(error);
    return;
  }
}
