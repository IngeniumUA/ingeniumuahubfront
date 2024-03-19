import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StaffDisplayMixinI, StaffItemDetailI} from '../../../../models/staff/staff_item_details';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {DisplayMixinDetailComponent} from '../display-mixin-detail/display-mixin-detail.component';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ValidURLCharacters} from '../../../../validators/ValidUrlCharacters';

@Component({
  selector: 'app-staff-item-detail',
  templateUrl: './staff-item-detail.component.html',
  styleUrls: ['./staff-item-detail.component.css'],
  imports: [
    NgIf,
    DisplayMixinDetailComponent,
    NgStyle,
    DatePipe,
    NgForOf,
    ReactiveFormsModule,
    MatInputModule
  ],
  standalone: true,
  providers: [DatePipe]
})
export class StaffItemDetailComponent implements OnInit{

  @Input() item!: StaffItemDetailI;
  @Input() editing: boolean = false;
  @Output() itemUpdate = new EventEmitter<StaffItemDetailI>;

  isEventItem: boolean = false;
  isShopItem: boolean = false;
  isPromoItem: boolean = false;

  form_error: string | null = null;
  loading: boolean = false;
  itemForm: any;

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe) {
  }
  ngOnInit() {
    this.isEventItem = this.item.event_item != null;
    this.isShopItem = this.item.shop_item != null;
    this.isPromoItem = this.item.promo_item != null;

    // Setting up form
    this.itemForm = this.formBuilder.group({
      name: [this.item.item.name, [Validators.required, ValidURLCharacters()]],
      description: [this.item.item.description],
      available: [this.item.item.available, Validators.required],
      disabled: [this.item.item.disabled, Validators.required],
    });
    // Adding event if required
    if (this.isEventItem) {
      this.itemForm.addControl('start_date', new FormControl(
        this.datePipe.transform(this.item.event_item.start_date, 'yyyy-MM-ddThh:mm')));
      this.itemForm.addControl('end_date', new FormControl(
        this.datePipe.transform(this.item.event_item.end_date, 'yyyy-MM-ddThh:mm')));
    }

    // Promo
    if (this.isPromoItem) {
      this.itemForm.addControl('displayFromDate', new FormControl(
        this.datePipe.transform(this.item.promo_item.display_from_date, 'yyyy-MM-ddThh:mm')));
      this.itemForm.addControl('displayUntilDate', new FormControl(
        this.datePipe.transform(this.item.promo_item.display_until_date, 'yyyy-MM-ddThh:mm')));
    }
  }

  onSubmit(): void {
    // Check if valid guardclause
    if (this.itemForm.invalid) {
      const error: Error = Error('Form error');
      console.log(error);
      this.handleFormError(error);
      return;  }

    this.loading = true;
    // The underlying components always send updated information in their fields up to the parent
    // When we send the formdata to the parent here, alle data is as seen on the page

    // This manually assignign all fields is not great code
    // So, to be changed later
    this.item.item.available = this.itemForm.controls['available'].value;
    this.item.item.disabled = this.itemForm.controls['disabled'].value;
    this.item.item.name = this.itemForm.controls['name'].value;
    this.item.item.description = this.itemForm.controls['description'].value;
    if (this.isEventItem) {
      this.item.event_item.start_date = this.itemForm.controls['start_date'].value;
      this.item.event_item.end_date = this.itemForm.controls['end_date'].value;
    }
    if (this.isPromoItem) {
      this.item.promo_item.display_from_date = this.itemForm.controls['displayFromDate'].value;
      this.item.promo_item.display_until_date = this.itemForm.controls['displayUntilDate'].value;
    }
    this.itemUpdate.emit(this.item);

    this.loading = false;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  UpdateDisplayMixin(displaymixin_obj: StaffDisplayMixinI, derived_type: number) {
    // Derived
    // 0: Event
    // 1: Shop
    // 2: Promo
    if (derived_type === 0) {
      this.item.event_item.display_mixin = displaymixin_obj;
    }
    if (derived_type === 1) {
      this.item.shop_item.display_mixin = displaymixin_obj;
    }
    if (derived_type === 2) {
      this.item.promo_item.display_mixin = displaymixin_obj;
    }
  }
}
