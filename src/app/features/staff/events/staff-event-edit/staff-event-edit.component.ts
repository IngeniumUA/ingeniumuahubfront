import {Component, Input, OnInit} from '@angular/core';
import {EventItemDetailI} from '../../../../shared/models/items/events';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-staff-event-edit',
  templateUrl: './staff-event-edit.component.html',
  styleUrls: ['./staff-event-edit.component.css'],
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  standalone: true
})
export class StaffEventEditComponent implements OnInit {
  @Input() event!: EventItemDetailI;
  form!: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.setForm();
  }

  // Form methods
  public setForm(): void {
    this.form = this.formBuilder.group({
      name: [this.event.item.name, Validators.required],
      description: [this.event.item.description, Validators.required],
      start_date: [this.event.start_date, Validators.required],
      end_date: [this.event.end_date, Validators.required],
      location: [this.event.location, Validators.required],
      follow_through_link: [this.event.follow_through_link, Validators.required],
      color: [this.event.color, Validators.required],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {

  }
}
