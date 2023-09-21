import {Component, Input} from '@angular/core';
import {ActivatedRoute, Route, Router, RouterLink} from "@angular/router";
import {HubCardI} from "../../../models/card";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {RolesService} from "../../../../core/services/user/roles.service";
import {Observable} from "rxjs";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

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
export class CardComponent {
  @Input() card: HubCardI | null = null
  @Input() is_lid: boolean = false
  @Input() on_account_page: boolean = false

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
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
  form = this.formBuilder.group({
    uuid: ['', Validators.required]
  })
  get f() { return this.form.controls; }
  public onSubmit() {
    this.submitted = true;
  }
}
