import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {PasswordService} from '../../../../core/services/user/password/password.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-page',
  templateUrl: './setpw.component.html',
})
export class SetpwComponent implements OnInit{
  form!: FormGroup;
  loading = false;
  submitted = false;


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private passwordService: PasswordService,
              private toastService: ToastrService
  ) { }
  uuid!: string;
  pw_settoken!: string;

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required]
    });
    const uuid = this.route.snapshot.paramMap.get('uuid');
    const pw_settoken = this.route.snapshot.paramMap.get('pw_settoken');
    if (!uuid || !pw_settoken){
      this.router.navigateByUrl('home');
      return;
    }
    else {
      this.uuid = uuid;
      this.pw_settoken = pw_settoken;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.passwordService.setPassword(this.uuid, this.pw_settoken, this.form.controls['password'].value).pipe(
      first()).subscribe({
      next: () => {
        this.toastService.success('Je wachtwoord is succesvol aangepast! Je kan nu opnieuw aanmelden.', 'Wachtwoord aangepast');
        this.router.navigateByUrl('/auth/login');
      },
      error: (error: any) => {
        this.loading = false;
        this.toastService.error(error.error.message, 'Er is iets misgegaan');
      }
    });
  }
}
