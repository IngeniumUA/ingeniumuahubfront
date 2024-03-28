import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../../../core/services/user/auth/auth.service';
import {SocialAuthService} from '@abacritt/angularx-social-login';
import {first} from 'rxjs/operators';
import {RegisterService} from '../../../../../core/services/user/register/register.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  facebookBrowser: boolean = false;

  privacyPolicyAccepted: boolean = false;
  privacyAcceptedControl = new FormControl(false);

  constructor(private registerService: RegisterService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private socialAuthService: SocialAuthService,
  ) { }

  ngOnInit() {
    if (this.authService.userValue) {
      this.router.navigate(['home']);
    }

    this.form = this.formBuilder.group({
      email: ['', Validators.email],
    });

    this.privacyAcceptedControl.valueChanges.subscribe(
      value => {
        if (value === null) {
          return;
        }
        this.privacyPolicyAccepted = value;
      }
    );

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
          this.handleRegisterError(error);
        }
      });
    }
    );

    // Facebook browser check
    const userAgent = window.navigator.userAgent;
    this.facebookBrowser = (userAgent.indexOf('FBAN') > -1) ||
      (userAgent.indexOf('FBAV') > -1) ||
      (userAgent.indexOf('Instagram') > -1);
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  form_error: string | null = null;

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Probeer een andere!');
      this.handleRegisterError(error);
      return;
    }
    if (this.loading) {
      return;
    }
    const email: string = this.form.controls['email'].value;
    if (email.includes('ad.ua.ac.be')) {
      const error: Error = Error('UAntwerpen mailadressen werken niet!');
      this.handleRegisterError(error);
      return;
    }
    if (email.includes('uantwerpen')) {
      const error: Error = Error('UAntwerpen mailadressen werken niet!');
      this.handleRegisterError(error);
      return;
    }


    this.loading = true;
    this.registerService.register(email).pipe(
      first()).subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/await_email');
      },
      error: (error: Error) => {
        this.loading = false;
        this.handleRegisterError(error);
      }
    });
  }

  handleRegisterError(err: Error) {
    if (err instanceof HttpErrorResponse) {
      if (err.status == 406) {
        this.form_error = 'Kan geen nieuw account aanmaken met die email';
        return;
      }
    } else {
      this.form_error = err.message;
    }
  }
}
