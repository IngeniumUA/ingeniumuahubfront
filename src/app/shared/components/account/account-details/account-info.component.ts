import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatRadioModule} from '@angular/material/radio';
import {HubUserPersonalDetailsI} from '@ingenium/app/shared/models/user';
import {AccountService} from '@ingenium/app/core/services/user/account/account.service';
import {first} from 'rxjs/operators';
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

    this.email = this.store.selectSnapshot(UserState.userDetails)?.google_mail || this.store.selectSnapshot(UserState.userDetails)?.email || '';
  }


  ngOnInit() {
    this.loadFieldsFromStore()
  }

  loadFieldsFromStore() {
    const details = this.store.selectSnapshot(UserState.userDetails)?.personal_details;
    if (!details) {
      return;
    }

    this.form = this.formBuilder.group({
      voornaam: [details.voornaam, Validators.required],
      achternaam: [details.achternaam, Validators.required],
      telefoonnummer: [details.telefoonnummer, Validators.required],
      gemeente: [details.gemeente, Validators.required],
      adres: [details.adres, Validators.required],
      huisnummer: [details.huisnummer, Validators.required],
      sport_interesse: [details.sport_interesse, Validators.required],
      doop_interesse: [details.doop_interesse, Validators.required],
      afstudeerrichting: [details.afstudeerrichting, Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

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
      voornaam: this.form.controls['voornaam'].value,
      achternaam: this.form.controls['achternaam'].value,
      telefoonnummer: this.form.controls['telefoonnummer'].value,
      gemeente: this.form.controls['gemeente'].value,
      adres: this.form.controls['adres'].value,
      huisnummer: this.form.controls['huisnummer'].value,
      sport_interesse: this.form.controls['sport_interesse'].value,
      doop_interesse: this.form.controls['doop_interesse'].value,
      afstudeerrichting: this.form.controls['afstudeerrichting'].value,
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
