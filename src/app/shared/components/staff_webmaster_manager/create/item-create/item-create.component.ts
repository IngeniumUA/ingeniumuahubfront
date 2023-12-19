import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Observable, of} from "rxjs";
import {StaffItemService} from "../../../../../core/services/staff/items/staff_item_router";
import {StaffItemCreateI} from "../../../../models/staff/staff_item_details";
import {first} from "rxjs/operators";
import {ValidURLCharacters} from "../../../../validators/ValidUrlCharacters";

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css'],
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    NgStyle
  ],
  standalone: true
})
export class ItemCreateComponent implements OnInit {

  $itemtype: Observable<string | null> = of("none") // none, event, shop, promo
  eventTypes: string[] = ["none", "event", "shop", "promo"]
  eventTypeControl = new FormControl<string>('none');

  itemCreateForm = this.formBuilder.group({
    itemName: ['', [Validators.required, ValidURLCharacters()]],
    itemDescription: ['', Validators.required],

    eventStartDate: ['', Validators.required],
    eventEndDate: ['', Validators.required],
    eventLocation: ['', Validators.required],

    color: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
    followThroughLink: ['', Validators.required],
    imageSquare: [''],
    imageLandscape: [''],
    previewDescription: [''],
  })

  form_error: string | null = null;
  loading: boolean = false

  @Output() ToggleCreating = new EventEmitter<boolean>()
  @Output() FinishedCreating = new EventEmitter<boolean>()

  constructor(private formBuilder: FormBuilder,
              private staffItemService: StaffItemService) {
  }

  ngOnInit() {
    this.$itemtype = this.eventTypeControl.valueChanges
  }

  onSubmit() {
    // Check if valid guardclause
    if (this.itemCreateForm.invalid) {
      const error: Error = Error("Fout ingevulde form ( client side )");
      this.handleFormError(error);
      return;  }

    this.loading = true;

    const createObject: StaffItemCreateI = {
      item: {
        name: this.itemCreateForm.controls['itemName'].value,
        description: this.itemCreateForm.controls['itemDescription'].value
      },
      event: {
        start_date: this.itemCreateForm.controls['eventStartDate'].value,
        end_date: this.itemCreateForm.controls['eventEndDate'].value,
        location: this.itemCreateForm.controls['eventLocation'].value,

        display_mixin: {
          color: this.itemCreateForm.controls['color'].value,
          follow_through_link: this.itemCreateForm.controls['followThroughLink'].value,
          image_square: this.itemCreateForm.controls['imageSquare'].value,
          image_landscape: this.itemCreateForm.controls['imageLandscape'].value,
          preview_description: this.itemCreateForm.controls['previewDescription'].value,
        }
      }
    }

    this.staffItemService.createItem(createObject).pipe(
      first()).subscribe({
      next: () => {
        this.FinishedCreating.emit(true)
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
