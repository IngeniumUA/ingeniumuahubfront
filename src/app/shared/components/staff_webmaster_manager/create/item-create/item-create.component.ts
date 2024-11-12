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
import {PromoItemInI, PromoItemTypeEnum, PromoItemTypes} from "@ingenium/app/shared/models/item/promoI";
import {EventItemInI} from "@ingenium/app/shared/models/item/eventI";
import {ShopItemInI} from "@ingenium/app/shared/models/item/shopI";
import {
  CardItemInI,
  CardMembershipEnum,
  CardMembershipEnumList,
  CardTypeEnum, CardTypeEnumList
} from "@ingenium/app/shared/models/item/cardI";
import {AvailabilityCompositionInI} from "@ingenium/app/shared/models/item/availabilityCompositionI";

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
  itemTypes: string[] = ['none', 'eventitem', 'shopitem', 'promoitem', 'carditem'];
  itemTypeControl = new FormControl<string>('none');

  itemCreateForm = this.formBuilder.group({
    itemName: ['', [Validators.required, ValidURLCharacters()]],
    itemDescription: ['', Validators.required],
  });

  eventCreateForm = this.formBuilder.group({
    eventStartDate: ['', Validators.required],
    eventEndDate: ['', Validators.required],
    eventLocation: ['', Validators.required],

    color: ['', [Validators.required]],
    followThroughLink: ['', Validators.required],
    imageSquare: [''],
    imageLandscape: [''],
    previewDescription: [''],
  });

  promoCreateForm = this.formBuilder.group({
    promoType: ['promo type', Validators.required],

    color: ['', [Validators.required]],
    followThroughLink: ['', Validators.required],
    imageSquare: [''],
    imageLandscape: [''],
    previewDescription: [''],
  });

  shopCreateForm = this.formBuilder.group({
    color: ['', [Validators.required]],
    followThroughLink: ['', Validators.required],
    imageSquare: [''],
    imageLandscape: [''],
    previewDescription: [''],
  });

  cardCreateForm = this.formBuilder.group({
    source_item_id: [0, [Validators.required]],
    member_type: [CardMembershipEnum.lid, Validators.required],
    card_type: [CardTypeEnum.qr_code_v1, Validators.required],
    card_uuid: ['', Validators.required]
  })

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

    const imageSquareControlValue: string = this.eventCreateForm.controls['imageSquare'].value!;
    const imageSquareValue = imageSquareControlValue === "" ? null : imageSquareControlValue;

    const imageLandscapeControlValue: string = this.eventCreateForm.controls['imageLandscape'].value!;
    const imageLandscapeValue = imageLandscapeControlValue === "" ? null : imageLandscapeControlValue;

    return {
      derived_type_enum: "eventitem",

      event_start: this.eventCreateForm.controls['eventStartDate'].value!,
      event_end: this.eventCreateForm.controls['eventEndDate'].value!,
      // location: this.eventCreateForm.controls['eventLocation'].value,

      display: {
        color: this.eventCreateForm.controls['color'].value!,
        follow_through_link: this.eventCreateForm.controls['followThroughLink'].value!,
        image_square: imageSquareValue,
        image_landscape: imageLandscapeValue,
        preview_description: this.eventCreateForm.controls['previewDescription'].value!,
      }
    };
  }

  parseShopForm(itemType: string): ShopItemInI | null {
    if (itemType !== this.itemTypes[2]) {
      return null;
    }

    const imageSquareControlValue: string = this.shopCreateForm.controls['imageSquare'].value!;
    const imageSquareValue = imageSquareControlValue === "" ? null : imageSquareControlValue;

    const imageLandscapeControlValue: string = this.shopCreateForm.controls['imageLandscape'].value!;
    const imageLandscapeValue = imageLandscapeControlValue === "" ? null : imageLandscapeControlValue;

    return {
      derived_type_enum: "shopitem",

      display: {
        color: this.shopCreateForm.controls['color'].value!,
        follow_through_link: this.shopCreateForm.controls['followThroughLink'].value!,
        image_square: imageSquareValue,
        image_landscape: imageLandscapeValue,
        preview_description: this.shopCreateForm.controls['previewDescription'].value!,
      }
    };
  }

  parsePromoForm(itemType: string): PromoItemInI | null {
    if (itemType !== this.itemTypes[3]) {
      return null;
    }

    const promoTypeControlValue = this.promoCreateForm.controls['promoType'].value!
    const promoType = parseInt(promoTypeControlValue);

    const imageSquareControlValue: string = this.promoCreateForm.controls['imageSquare'].value!;
    const imageSquareValue = imageSquareControlValue === "" ? null : imageSquareControlValue;

    const imageLandscapeControlValue: string = this.promoCreateForm.controls['imageLandscape'].value!;
    const imageLandscapeValue = imageLandscapeControlValue === "" ? null : imageLandscapeControlValue;

    return {
      derived_type_enum: "promoitem",
      promo_type: promoType,
      display: {
        color: this.promoCreateForm.controls['color'].value!,
        follow_through_link: this.promoCreateForm.controls['followThroughLink'].value!,
        image_square: imageSquareValue,
        image_landscape: imageLandscapeValue,
        preview_description: this.promoCreateForm.controls['previewDescription'].value!,
      }
    }
  }

  public parseCardForm(itemType: string): null | CardItemInI {
    if (itemType !== this.itemTypes[4]) {
      return null;
    }
    return {
      derived_type_enum: "carditem",
      source_item_id: this.cardCreateForm.controls['source_item_id'].value!,
      member_type: this.cardCreateForm.controls['member_type'].value!,
      card_type: this.cardCreateForm.controls['card_type'].value!,
      card_uuid: this.cardCreateForm.controls['card_uuid'].value!,
    }
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
    const card = this.parseCardForm(itemType);

    const derivedType = event !== null ? event: promo !== null ? promo: shop !== null ? shop: card;

    // Temp hardcode to set availability on a card obj to True
    const availability: AvailabilityCompositionInI | null = card === null ? null: {
      available: true,
      disabled: null,
      dynamic_policy_type: null,
      dynamic_policy_content: null
    }

    const createObject: ItemWideInI = {
      item: {
        name: this.itemCreateForm.controls['itemName'].value!,
        description: this.itemCreateForm.controls['itemDescription'].value!,
        availability: availability
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

  protected readonly CardMembershipEnumList = CardMembershipEnumList;
  protected readonly CardMembershipEnum = CardMembershipEnum;
  protected readonly CardTypeEnumList = CardTypeEnumList;
  protected readonly CardTypeEnum = CardTypeEnum;
  protected readonly PromoItemTypes = PromoItemTypes;
  protected readonly PromoItemTypeEnum = PromoItemTypeEnum;
}
