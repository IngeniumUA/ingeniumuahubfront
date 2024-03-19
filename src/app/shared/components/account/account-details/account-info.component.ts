import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatRadioModule} from "@angular/material/radio";
import {HubAccountData, HubUserPersonalDetailsI} from "../../../models/user";
import {AccountService} from "../../../../core/services/user/account/account.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
  imports: [
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    NgStyle,
    NgIf,
    MatRadioModule,
    NgForOf,
    KeyValuePipe
  ],
  standalone: true
})
export class AccountInfo implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private accountService: AccountService) {
  }

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

  ngOnInit() {
    this.form = this.formBuilder.group({
      voornaam: [this.input_model.voornaam, Validators.required],
      achternaam: [this.input_model.achternaam, Validators.required],
      telefoonnummer: [this.input_model.telefoonnummer, Validators.required],
      gemeente: [this.input_model.gemeente, Validators.required],
      adres: [this.input_model.adres, Validators.required],
      huisnummer: [this.input_model.huisnummer, Validators.required],
      sport_interesse: [this.input_model.sport_interesse.toString(), Validators.required],
      doop_interesse: [this.input_model.doop_interesse.toString(), Validators.required],
      afstudeerrichting: [this.input_model.afstudeerrichting, Validators.required]
    })
  }

  @Input() input_model!: HubUserPersonalDetailsI
  @Input() success_message: string | null = null;
  @Output() accountEvent = new EventEmitter<string>();

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  // Handling errors
  handleFormError(err: Error) {
    if (!(err instanceof HttpErrorResponse)) {
      this.form_error = err.message;
      this.success_message = null;
      return;
    } else {
      if (err.status == 401) {
        this.form_error = err.message;
        this.success_message = null;
        return
      }
    }
  }


  onSubmit() {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error("Ongeldig formulier!");
      this.handleFormError(error);
      return;
    }
    if (this.loading) {
      return
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
    }
    this.accountService.updatePersonalDetails(personalDetails).pipe(
      first()).subscribe({
      next: () => {
        // If successfull, we want to send a message to
        this.accountEvent.emit("submitted")
        //this.form_success = "Updated!"
        // console.log(this.form_success)
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    })
    this.loading = false
  }
}
