import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {AuthService} from "../../../../core/services/user/auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})
export class RegisterComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.userValue) {
      this.router.navigate(['home'])
    }

    this.form = this.formBuilder.group({
      email: ['', Validators.email]
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {return;}

    this.loading = true;
    // TODO register
    console.log("Robbe moet dees nog implementeren xoxo")
  }
}
