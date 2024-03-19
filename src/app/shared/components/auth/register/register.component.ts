import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {AuthService} from '../../../../core/services/user/auth/auth.service';
import {RegisterService} from '../../../../core/services/user/register/register.service';
import {GoogleSigninButtonModule} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    GoogleSigninButtonModule
  ],
  standalone: true
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private registerService: RegisterService,
  ) { }

  ngOnInit() {
    if (this.authService.userValue) {
      this.router.navigate(['home']);
    }

    this.form = this.formBuilder.group({
      email: ['', Validators.email]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {return;}

    this.loading = true;
    this.registerService.register(this.form.controls['email'].value).subscribe();
  }
}
