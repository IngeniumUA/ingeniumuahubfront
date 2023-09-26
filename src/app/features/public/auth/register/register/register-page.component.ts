import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../../core/services/user/auth/auth.service";
import {SocialAuthService} from "@abacritt/angularx-social-login";
import {first} from "rxjs/operators";
import {RegisterService} from "../../../../../core/services/user/register/register.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(private registerService: RegisterService,
              private formBuilder: FormBuilder,
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
            console.log(error);
          }
        })
      }
    )
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  form_error: string | null = null;

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Probeer een andere!");
      this.handleFormError(error);
      return;
    }
    if (this.loading) {
      return;
    }
    const email: string = this.form.controls['email'].value
    if (email.includes("ad.ua.ac.be")) {
      const error: Error = Error("UAntwerpen mailadressen werken niet!");
      this.handleFormError(error);
      return;
    }
    if (email.includes("uantwerpen")) {
      const error: Error = Error("UAntwerpen mailadressen werken niet!");
      this.handleFormError(error);
      return;
    }


    this.loading = true;
    this.registerService.register(email).pipe(
      first()).subscribe({
      next: () => {
        this.router.navigateByUrl('/home')
      },
      error: (error: Error) => {
        this.loading = false;
        this.handleFormError(error);
      }
    })
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }
}
