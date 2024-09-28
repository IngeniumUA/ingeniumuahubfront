import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Observable, of} from 'rxjs';
import {first} from 'rxjs/operators';
import {ValidURLCharacters} from '../../../../validators/ValidUrlCharacters';
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {ItemWideInI} from "@ingenium/app/shared/models/item/itemwideI";
import {PromoItemInI, PromoItemTypes} from "@ingenium/app/shared/models/item/promoI";
import {EventItemInI} from "@ingenium/app/shared/models/item/eventI";
import {ShopItemInI} from "@ingenium/app/shared/models/item/shopI";

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
  $itemType: Observable<string | null> = of('none'); // none, event, shop, promo
  itemTypes: string[] = ['none', 'eventitem', 'shopitem', 'promoitem'];
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
              private staffItemService: ItemWideService) {
  }

  ngOnInit() {
    this.$itemType = this.itemTypeControl.valueChanges;
  }

  parseEventForm(itemType: string): EventItemInI | null {
    if (itemType !== this.itemTypes[1]) {
      return null;
    }
    return {
      derived_type_enum: "eventitem",

      event_start: this.eventCreateForm.controls['eventStartDate'].value!,
      event_end: this.eventCreateForm.controls['eventEndDate'].value!,
      // location: this.eventCreateForm.controls['eventLocation'].value,

      display: {
        color: this.eventCreateForm.controls['color'].value!,
        follow_through_link: this.eventCreateForm.controls['followThroughLink'].value!,
        image_square: this.eventCreateForm.controls['imageSquare'].value!,
        image_landscape: this.eventCreateForm.controls['imageLandscape'].value!,
        preview_description: this.eventCreateForm.controls['previewDescription'].value!,
      }
    };
  }

  parseShopForm(itemType: string): ShopItemInI | null {
    if (itemType !== this.itemTypes[2]) {
      return null;
    }
    // TODO Refactoring ...
    return null;
  }

  parsePromoForm(itemType: string): PromoItemInI | null {
    if (itemType !== this.itemTypes[3]) {
      return null;
    }
    // TODO Refactoring ...
    return null;
    // return {
    //   display_from_date: this.promoCreateForm.controls['displayFromDate'].value,
    //   display_until_date: this.promoCreateForm.controls['displayUntilDate'].value,
    //   type: this.promoCreateForm.controls['promoType'].value,
    //
    //   display_mixin: {
    //     color: this.promoCreateForm.controls['color'].value,
    //     follow_through_link: this.promoCreateForm.controls['followThroughLink'].value,
    //     image_square: this.promoCreateForm.controls['imageSquare'].value,
    //     image_landscape: this.promoCreateForm.controls['imageLandscape'].value,
    //     preview_description: this.promoCreateForm.controls['previewDescription'].value,
    //   }
    // };
  }


  onSubmit(itemType: string) {
    // Check if valid guardclause
    if (this.itemCreateForm.invalid) {
      const error: Error = Error('Fout ingevulde form ( client side )');
      this.handleFormError(error);
      return;
    }

    this.loading = true;

    const event = this.parseEventForm(itemType);
    const promo = this.parsePromoForm(itemType);
    const shop = this.parseShopForm(itemType);

    const derivedType = event !== null ? event: promo !== null ? promo: shop;
    const createObject: ItemWideInI = {
      item: {
        name: this.itemCreateForm.controls['itemName'].value!,
        description: this.itemCreateForm.controls['itemDescription'].value!,
        availability: null
      },
      derived_type: derivedType
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

  protected readonly PromoTypes = PromoItemTypes;
}
