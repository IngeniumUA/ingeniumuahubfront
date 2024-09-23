import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {HubUserPersonalDetailsI} from '@ingenium/app/shared/models/user/user';
import {AccountService} from '@ingenium/app/core/services/user/account/account.service';
import {first, take} from 'rxjs/operators';
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    NgStyle,
    NgIf,
    MatRadioModule,
    NgForOf,
    KeyValuePipe,
    AsyncPipe,
  ],
  standalone: true
})
export class AccountInfoComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  form_error: string | null = null;
  graduationTracts = {
    'bouwkunde': 'Bouwkunde',
    'elektromechanica': 'Elektromechanica',
    'elektronica_ict': 'Elektronica-ICT',
    'chemie': 'Chemie',
    'biochemie': 'Biochemie',
    'uantwerpen': 'UAntwerpen',
    'other': 'Andere'
  };

  email;

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService,
              private store: Store,
              private toastr: ToastrService) {

    this.email = this.store.selectSnapshot(UserState.getEmail);
    this.form = this.formBuilder.group({
      telephone: ['', Validators.required],
      recreation_interest: [false, Validators.required],
      sport_interest: [false, Validators.required],
      relations_interest: [false, Validators.required],
      graduation_tract: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.loadFieldsFromStore()
  }

  loadFieldsFromStore() {
    this.accountService.getAccount().subscribe(details => {
      if (!details) {
        return;
      }

      this.form = this.formBuilder.group({
        telephone: [details.telephone, Validators.required],
        recreation_interest: [details.recreation_interest, Validators.required],
        sport_interest: [details.sport_interest, Validators.required],
        relations_interest: [details.relations_interest, Validators.required],
        graduation_tract: [details.graduation_tract, Validators.required]
      });
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.loading) return;
    this.form.markAllAsTouched();

    // Check if valid guard clause
    if (this.form.invalid) {
      this.toastr.error('Ongeldig formulier!', 'Fout');
      return;
    }

    this.loading = true;
    const personalDetails: HubUserPersonalDetailsI = {
      given_name: '',
      last_name: '',
      telephone: this.form.controls['telephone'].value,
      recreation_interest: this.form.controls['recreation_interest'].value,
      sport_interest: this.form.controls['sport_interest'].value,
      relations_interest: this.form.controls['relations_interest'].value,
      graduation_tract: this.form.controls['graduation_tract'].value,
    };

    this.accountService.updatePersonalDetails(personalDetails).pipe(first()).subscribe({
      next: () => {
        this.toastr.success('Account gegevens succesvol geüpdatet!', 'Succes');
      },
      error: error => {
        this.loading = false;
        console.error(error); // TODO: Handle error in a better way
      }
    });
    this.loading = false;
  }

  protected readonly document = document;
}
