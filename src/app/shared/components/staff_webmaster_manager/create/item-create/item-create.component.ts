import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Observable, of} from 'rxjs';
import {StaffItemService} from '../../../../../core/services/staff/items/staff_item_router';
import {StaffItemCreateI} from '../../../../models/staff/staff_item_details';
import {first} from 'rxjs/operators';
import {ValidURLCharacters} from '../../../../validators/ValidUrlCharacters';
import {PromoTypes} from '../../../../models/items/promo';

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

  $itemtype: Observable<string | null> = of('none'); // none, event, shop, promo
  itemTypes: string[] = ['none', 'event', 'shop', 'promo'];
  itemTypeControl = new FormControl<string>('none');

  itemCreateForm = this.formBuilder.group({
    itemName: ['', [Validators.required, ValidURLCharacters()]],
    itemDescription: ['', Validators.required],
  });

  eventCreateForm = this.formBuilder.group({
    eventStartDate: ['', Validators.required],
    eventEndDate: ['', Validators.required],
    eventLocation: ['', Validators.required],

    color: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
    followThroughLink: ['', Validators.required],
    imageSquare: [''],
    imageLandscape: [''],
    previewDescription: [''],
  });

  promoCreateForm = this.formBuilder.group({
    displayFromDate: ['', Validators.required],
    displayUntilDate: ['', Validators.required],
    promoType: ['promo type', Validators.required],

    color: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
    followThroughLink: ['', Validators.required],
    imageSquare: [''],
    imageLandscape: [''],
    previewDescription: [''],
  });

  form_error: string | null = null;
  loading: boolean = false;

  @Output() ToggleCreating = new EventEmitter<boolean>();
  @Output() FinishedCreating = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
              private staffItemService: StaffItemService) {
  }

  ngOnInit() {
    this.$itemtype = this.itemTypeControl.valueChanges;
  }

  parseEventForm(itemType: string) {
    if (itemType !== this.itemTypes[1]) {
      return null;
    }
    return {
      start_date: this.eventCreateForm.controls['eventStartDate'].value,
      end_date: this.eventCreateForm.controls['eventEndDate'].value,
      location: this.eventCreateForm.controls['eventLocation'].value,

      display_mixin: {
        color: this.eventCreateForm.controls['color'].value,
        follow_through_link: this.eventCreateForm.controls['followThroughLink'].value,
        image_square: this.eventCreateForm.controls['imageSquare'].value,
        image_landscape: this.eventCreateForm.controls['imageLandscape'].value,
        preview_description: this.eventCreateForm.controls['previewDescription'].value,
      }
    };
  }

  parseShopForm(itemType: string) {
    if (itemType !== this.itemTypes[2]) {
      return null;
    }
    return null;
  }

  parsePromoForm(itemType: string) {
    if (itemType !== this.itemTypes[3]) {
      return null;
    }
    return {
      display_from_date: this.promoCreateForm.controls['displayFromDate'].value,
      display_until_date: this.promoCreateForm.controls['displayUntilDate'].value,
      type: this.promoCreateForm.controls['promoType'].value,

      display_mixin: {
        color: this.promoCreateForm.controls['color'].value,
        follow_through_link: this.promoCreateForm.controls['followThroughLink'].value,
        image_square: this.promoCreateForm.controls['imageSquare'].value,
        image_landscape: this.promoCreateForm.controls['imageLandscape'].value,
        preview_description: this.promoCreateForm.controls['previewDescription'].value,
      }
    };
  }


  onSubmit(itemType: string) {
    // Check if valid guardclause
    if (this.itemCreateForm.invalid) {
      const error: Error = Error('Fout ingevulde form ( client side )');
      this.handleFormError(error);
      return;
    }

    this.loading = true;

    const createObject: StaffItemCreateI = {
      item: {
        name: this.itemCreateForm.controls['itemName'].value,
        description: this.itemCreateForm.controls['itemDescription'].value
      },
      event: this.parseEventForm(itemType),
      promo: this.parsePromoForm(itemType),
      shop: this.parseShopForm(itemType)
    };

    this.staffItemService.createItem(createObject).pipe(
      first()).subscribe({
      next: () => {
        this.FinishedCreating.emit(true);
      },
      error: error => {
        this.loading = false;
        this.handleFormError(error);
      }
    });
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  protected readonly PromoTypes = PromoTypes;
}
