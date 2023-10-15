import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router, RouterLink} from "@angular/router";
import {HubCardI} from "../../../models/card";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {RolesService} from "../../../../core/services/user/roles.service";
import {Observable} from "rxjs";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AccountService} from "../../../../core/services/user/account/account.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})
export class CardComponent implements OnInit {
  @Input() card: HubCardI | null = null
  @Input() is_lid: boolean = false
  @Input() on_account_page: boolean = false

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private accountService: AccountService) {
  }

  success_notification: string | null = null
  failed_notification: string | null = null

  ngOnInit() {
    const notification: string | null = this.route.snapshot.queryParams['card_notification'] || null;
    if (notification != null) {
      if (notification.startsWith('s')) {
        this.success_notification = notification.slice(2)
      } else if (notification.startsWith('f')) {
        this.failed_notification = notification.slice(2)
      }
    }
  }

  public cardClicked() {
    if (!this.is_lid) {
      this.router.navigate(['/shop'])
      return;
    }
    if (this.card && this.on_account_page) {
      this.router.navigate(['account/card'])
      return;
    }
  }


  submitted: boolean = false
  loading: boolean = false;
  form_error: string | null = null;
  form = this.formBuilder.group({
    uuid: ['', Validators.required]
  })

  get f() {
    return this.form.controls;
  }

  public onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Invalid UUID");
      this.handleFormError(error);
      return;
    }

    this.loading = true;
    this.accountService.linkCard(this.form.controls['uuid'].value!).pipe(
      first()).subscribe({
      next: () => {
        // Emit via output instead of reloading page
        window.location.reload();
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    })
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  }
