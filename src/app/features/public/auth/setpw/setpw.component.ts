import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs/operators";
import {PasswordService} from "../../../../core/services/user/password/password.service";

@Component({
  selector: 'app-setpw',
  templateUrl: './setpw.component.html',
  styleUrls: ['./setpw.component.css']
})
export class SetpwComponent implements OnInit{
  form!: FormGroup;
  loading = false;
  submitted = false;


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private passwordService: PasswordService,
  ) { }
  uuid!: string;
  pw_settoken!: string;
  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required]
    })
    const uuid = this.route.snapshot.paramMap.get('uuid')
    const pw_settoken = this.route.snapshot.paramMap.get('pw_settoken')
    if (!uuid || !pw_settoken){
      this.router.navigateByUrl('');
      return
    }
    else {
      this.uuid = uuid;
      this.pw_settoken = pw_settoken;
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      console.log("Foutje")
      return;
    }

    this.loading = true;

    this.passwordService.setPassword(this.uuid, this.pw_settoken, this.form.controls['password'].value).pipe(
      first()).subscribe({
      next: () => {
        // get return url from query parameters ( so, ?next='' in the url), else default to home page
        const returnUrl = this.route.snapshot.queryParams['next'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (error: any) => {
        this.loading = false;
        console.log(error);
      }
    })
  }
}
