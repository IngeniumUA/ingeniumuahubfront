import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AccountService} from '../../../../core/services/user/account/account.service';
import {first} from 'rxjs/operators';
import {Observable} from "rxjs";
import {CardItemI} from "@ingenium/app/shared/models/item/cardI";

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
  @Input() is_lid: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private accountService: AccountService) {
  }

  $card: Observable<CardItemI> | null = null;
  success_notification: string | null = null;
  failed_notification: string | null = null;

  ngOnInit() {
    this.$card = this.accountService.getCard();

    const notification: string | null = this.route.snapshot.queryParams['card_notification'] || null;
    if (notification != null) {
      if (notification.startsWith('s')) {
        this.success_notification = notification.slice(2);
      } else if (notification.startsWith('f')) {
        this.failed_notification = notification.slice(2);
      }
    }
  }

  public cardClicked() {
    if (!this.is_lid) {
      this.router.navigate(['/shop']);
      return;
    }
  }


  submitted: boolean = false;
  loading: boolean = false;
  form_error: string | null = null;
  form = this.formBuilder.group({
    uuid: ['', Validators.required]
  });

  get f() {
    return this.form.controls;
  }

  public onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Foutieve code ingevuld');
      this.handleFormError(error);
      return;
    }

    this.loading = true;
    this.form_error = null;
    this.accountService.linkCard(this.form.controls['uuid'].value!).pipe(
      first()).subscribe({
      next: () => {
        // Emit via output instead of reloading page
        window.location.reload();
      },
      error: error => {
        this.loading = false;

        // Get response status code
        if (error.status && error.status === 406) {
          this.form_error = "Deze kaart kon niet gekoppeld worden. Mogelijks is de code fout of is deze al gekoppeld met een ander account.";
        } else {
          this.handleFormError(error);
        }
      }
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
