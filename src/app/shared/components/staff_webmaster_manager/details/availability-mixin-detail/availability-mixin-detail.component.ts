import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-availability-mixin-detail',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './availability-mixin-detail.component.html',
  styleUrl: './availability-mixin-detail.component.scss'
})
export class AvailabilityMixinDetailComponent implements OnInit {

  @Input() availability!: AvailabilityCompositionI;
  @Output() public availabilityUpdated = new EventEmitter<AvailabilityCompositionI>();

  constructor(private formBuilder: FormBuilder) {}

  form!: FormGroup;

  ngOnInit() {
    this.form = this.formBuilder.group({
      available: new FormControl(this.availability.available, [Validators.required]),
      available_from: new FormControl(this.availability.available_from),
      available_until: new FormControl(this.availability.available_until)
    });

    this.form.valueChanges.subscribe((val: AvailabilityCompositionI) => {
      const putModel: AvailabilityCompositionI = {
        available: val.available,
        available_from: val.available_from === '' ? null : val.available_from,
        available_until: val.available_until === '' ? null : val.available_until,
        disabled: false,
        dynamic_policy_type: this.availability.dynamic_policy_type,
        dynamic_policy_content: this.availability.dynamic_policy_content
      }
      this.availabilityUpdated.emit(putModel);
    });
  }
}
